---
title: XUnit Testing with TheoryData
layout: layouts/posts.tsx
url: './index.html'
date: 2025-02-13T05:00:00Z
categories:
  - Testing
  - dotnet
tags:
  - xunit
---
I have been using `xUnit` for a while and just recently learned about a couple of other ways of supplying test data to `Theory` tests besides using the `InlineData` attribute. When using the `Theory` attribute, I will traditionally add several `InlineData` attributes to supply the test with test data, but this attribute is limited with the kind of data you can use with it.  Typically, anything beyond a primitive type will not work with `InlineData`, so you either have to write multiple tests that have the same Act/Assert sections but with different Arrange sections.  Or have the inline data supply a lot of extra piecemeal that is then used to build more objects as part of the Arrange section.  I recently found out about the [`ClassData`](#using-classdata-attribute) and the [`MemberData`](#using-memberdata-attribute) attributes that allow you to create much more complex test data setups. I will show examples of these but lets start with sample code and the initial way I would have written a test before using `InlineData`.

> Note: Below examples can also be viewed [fear-of-the-undefined-examples repo](https://github.com/paulmfischer/fear-of-the-undefined-examples/tree/main/xunit-theory). All examples can be run with dotnet unless otherwise specified.

Take for example this arbitrary `Add` method that allows nullable values to be passed.
```csharp
public static class Math
{
  public static int Add(int? a, int? b, int? c)
  {
    return (a ?? 0) + (b ?? 0) + (c ?? 0);
  }
}
```
## Using `InlineData` Attribute
With `InlineData`, you supply an additional attribute for each set of data you want to test.  Your test method then takes in a parameter for each argument passed.  This works well (especially in this case) where you are only passing primitive values into your test method.  If you need to pass more complex data, you will want to use [`ClassData`](#using-classdata-attribute) or [`MemberData`](#using-memberdata-attribute), see the sections below.
```csharp
[Theory]
[InlineData(1, 2, 3, 6)]
[InlineData(1, null, 3, 4)]
[InlineData(1, null, null, 1)]
public void Add_ReturnsCorrectValue(int? a, int? b, int? c, int expected)
{
  var result = Math.Add(a, b, c);

  Assert.Equal(expected, result);
}
```

## Using `ClassData` Attribute
If you need to pass more complex data, you will want to use `ClassData` or `MemberData`. This is where the other attributes really shine! There are two ways to setup a test using `ClassData`, 1. building a class with test data that extends `IEnumerable<object[]>`, or 2. building a class with test data that extends `TheoryData<T>`.
### 1. Test data extending `IEnumerable<object[]>`
```csharp
public class ClassDataEnumerableGenerator : IEnumerable<object[]>
{
  private readonly IList<object[]> data =
  [
    [1, 2, 3, 6],
    [1, null, 3, 4],
    [1, null, null, 1],
  ];
    
  public IEnumerator<object[]> GetEnumerator() => data.GetEnumerator();

  System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();
}

[Theory]
[ClassData(typeof(ClassDataEnumerableGenerator))]
public void ClassDataEnumerable_Add_ReturnsCorrectValue(int? a, int? b, int? c, int expected)
{
  var result = Math.Add(a, b, c);

  Assert.Equal(expected, result);
}
```
The setup of the `data` inside the `ClassDataEnumerableGenerate` could be done in different ways to allow you to generate more complex data as well.  Each item in the list represents one run of the `ClassDataEnumerable_Add_ReturnsCorrectValue` test with the arguments of the array passed in.

### 2. Test data extending `TheoryData<T>`
The second way of setting up test data is to create a class of test data that extends `TheoryData<T>`. I find this method a little cleaner when it comes to setting up your test data. You can define a class the describes your test data that I find more readable.  There are some downsides though. One being that it does require you to create classes in your tests for this data. I found using a `record` helps to keep the bloat down to a minimum if need be.  Another downside is that the test method takes in the class instead of argument for each piece of data. But depending on what you are testing, this might be more useful.  So it really comes down to how you prefer to follow the code and setup tests.
```csharp
public record TestData(int? a, int? b, int? c, int expected);
public class ClassDataTheoryDataGenerator : TheoryData<TestData>
{
  public ClassDataTheoryDataGenerator()
  {
    Add(new TestData(1, 2, 3, 6));
    Add(new TestData(1, null, 3, 4));
    Add(new TestData(1, null, null, 1));
  }
}

[Theory]
[ClassData(typeof(ClassDataTheoryDataGenerator))]
public void ClassDataTheoryData_Add_ReturnsCorrectValue(TestData testData)
{
  var result = Math.Add(testData.a, testData.b, testData.c);

  Assert.Equal(testData.expected, result);
}
```

## Using `MemberData` Attribute
Using the `MemberData` attribute is very similar to the `ClassData`.  The difference being that you can define different data sets inside the test generator class (`MemberDataGenerator` in this case) and reference those methods for each test that is needed (`[MemberData(nameof(MemberDataGenerator.TestData), MemberType = typeof(MemberDataGenerator))]`). In my data generator class I have another method (`OtherTestData`) that could be used for another test if need be, this allows you to kind of group your test data generator together. You could have one class that has a success data method and an error data method.
```csharp
public static class MemberDataGenerator
{
  public static IEnumerable<object[]> TestData()
  {
    yield return [1, 2, 3, 6];
    yield return [1, null, 3, 4];
    yield return [1, null, null, 1];
  }
  
  public static IEnumerable<object[]> OtherTestData()
  {
    yield return ["something"];
  }
}

[Theory]
[MemberData(nameof(MemberDataGenerator.TestData), MemberType = typeof(MemberDataGenerator))]
public void MemberDataEnumerable_Add_ReturnsCorrectValue(int? a, int? b, int? c, int expected)
{
  var result = Math.Add(a, b, c);

  Assert.Equal(expected, result);
}
```