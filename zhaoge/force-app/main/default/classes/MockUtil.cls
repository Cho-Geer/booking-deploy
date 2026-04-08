public with sharing class MockUtil {
    private MockUtil() {}
    public static MockProvider getInstance(){
        return new MockProvider();
    }

    public static Object createMock(Type typeToMock){
        return System.Test.createStub(typeToMock, MockUtil.getInstance());
    }
}