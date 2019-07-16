import LambdaTester from 'lambda-tester';
import { getDefects } from '../../src/functions/getDefects';
import {expect} from 'chai';
import lambdaTester = require('lambda-tester');

describe('getDefects', () => {
  it('should return a promise', () => {
    const lambda = lambdaTester(getDefects);
    return lambda.expectResolve((response: any) => {
      expect(response).to.exist;
    });
  });
});
