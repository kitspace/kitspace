import { hashString } from "../../modules/hash";
describe('hash', function () {
  it('should returned a murmur hashed string from a query string', function () {
    var hash = hashString("{ todos { id } }");
    expect(hash).toBe('1rvkz44');
  });
});