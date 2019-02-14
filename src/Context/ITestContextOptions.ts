export interface ITestContextOptions {
    /*
     * Depth limit for matching the test case method when calling TestContext.Attachments
     * API's or TestContext.getCurrentTestName in a nested function
     */
    callerMatchDepth: number;
}