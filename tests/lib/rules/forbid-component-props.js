/**
 * @fileoverview Tests for forbid-component-props
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-component-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('forbid-component-props', rule, {
  valid: parsers.all([
    {
      code: `
        var First = createReactClass({
          render: function() {
            return <div className="foo" />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          render: function() {
            return <div style={{color: "red"}} />;
          }
        });
      `,
      options: [{ forbid: ['style'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo bar="baz" />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      options: [{ forbid: ['style'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      options: [{ forbid: ['style', 'foo'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <this.Foo bar="baz" />;
          }
        });
      `,
    },
    {
      code: `
        class First extends createReactClass {
          render() {
            return <this.foo className="bar" />;
          }
        }
      `,
      options: [{ forbid: ['style'] }],
    },
    {
      code: `
        const First = (props) => (
          <this.Foo {...props} />
        );
      `,
    },
    {
      code: `
        const item = (<ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<AntdLayout.Content className="antdFoo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['AntdLayout.Content'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['this.ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        <fbt:param name="Total number of files" number={true} />
      `,
      features: ['jsx namespace'],
    },
    {
      code: `
        const item = (
          <Foo className="bar">
            <ReactModal style={{color: "red"}} />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['OtherModal', 'ReactModal'],
            },
            {
              propName: 'style',
              disallowedFor: ['Foo'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <Foo className="bar">
            <ReactModal style={{color: "red"}} />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['OtherModal', 'ReactModal'],
            },
            {
              propName: 'style',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedForRegex: '^Fo{2}$',
            },
          ],
        },
      ],
    },
    {
      code: `
        const item = (
          <Parent className="foo">
            <ThingOne className="bar">
              <ThingTwo className="baz" />
            </ThingOne>
          </Parent>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['Parent'],
              allowedForRegex: '^Thing',
            },
          ],
        },
      ],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'style' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      options: [{ forbid: ['className', 'style'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 5,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `,
      options: [{ forbid: ['className', 'style'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'style' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `,
      options: [
        {
          forbid: [
            {
              propName: 'style',
              disallowedFor: ['Foo'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'style' },
          line: 5,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 40,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<this.ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['this.ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 40,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<ReactModal className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['ReactModal'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 35,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<AntdLayout.Content className="antdFoo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['AntdLayout.Content'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 2,
          column: 43,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = (<Foo className="foo" />);
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              message: 'Please use ourCoolClassName instead of ClassName',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Please use ourCoolClassName instead of ClassName',
          line: 2,
          column: 28,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = () => (
          <Foo className="foo">
            <Bar option="high" />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              message: 'Please use ourCoolClassName instead of ClassName',
            },
            {
              propName: 'option',
              message: 'Avoid using option',
            },
          ],
        },
      ],
      errors: [
        {
          message: 'Please use ourCoolClassName instead of ClassName',
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using option',
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = () => (
          <Foo className="foo">
            <Bar option="high" />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            { propName: 'className' },
            {
              propName: 'option',
              message: 'Avoid using option',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using option',
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = () => (
          <Foo className="foo">
            <Bar className="bar" />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['Foo'],
              disallowedForRegex: '^B',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const item = () => (
          <Foo className="foo">
            <Bar className="bar" />
          </Foo>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedForRegex: '^B',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
  ]),
});
