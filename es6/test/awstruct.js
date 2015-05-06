import assert from 'assert';
import awstruct from '../awstruct';

describe('awstruct', () => {
  it('should get/set region', () => {
    awstruct.region = 'us-west-2';
    assert.equal(awstruct.region, 'us-west-2');
    assert.equal(awstruct.config.region, 'us-west-2');
  });

  it('should get/set system', () => {
    awstruct.system = 'my system name';
    assert.equal(awstruct.system, 'my system name');
    assert.equal(awstruct.config.system, 'my system name');
  });

  describe('getResourceName', () => {
    it('should compose resource name from config and terminalName', () => {
      let result = awstruct.getResourceName('foo');
      assert.equal(result, 'mySystemName-usWest2-foo');
    });
  });

  describe('getResourceKey', () => {
    it('should compose resource key from the terminalName', () => {
      let result = awstruct.getResourceKey('foo');
      assert.equal(result, 'mySystemNameUsWest2Foo');
    });
  });

  describe('resource', () => {
    it('should return factory function', () => {
      let factory = awstruct.resource();
      assert.ok(typeof factory === 'function');
    });

    it('should create resource inheriting base state and methods', () => {
      let factory = awstruct.resource({name: 'myName'}, () => {
        return {
          foo() {
            return 'foo';
          },

          bar() {
            return 'bar';
          }
        };
      });

      let resource = factory({name: 'overrideName'});

      assert.equal(resource.name, 'overrideName');
      assert.equal(
        resource.fullyQualifiedName,
        'mySystemName-usWest2-overrideName'
      );
      assert.equal(
        resource.key,
        'mySystemNameUsWest2OverrideName'
      );
      assert.equal(resource.foo(), 'foo');
      assert.equal(resource.bar(), 'bar');
    });
  });
});
