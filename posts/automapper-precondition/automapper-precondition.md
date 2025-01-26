---
title: Automapper PreCondition
layout: layouts/posts.tsx
url: './index.html'
date: 2024-10-17T05:00:00Z
categories:
  - Object Mappers
tags:
  - automapper
---
I recently had a use case where I needed to conditionally map a property when mapping an object.  In the past, I would have mapped the object as you typically do with AutoMapper like so `var barInstance = mapper.Map<Bar>(fooInstance)` and then set the property on `barInstance` depending on the state of `fooInstance`.  I found out that all this can be done in your map configuration with [Conditional Mappings](https://docs.automapper.org/en/stable/Conditional-mapping.html) in AutoMapper.

For example, lets say we have the following two classes:
```csharp
class Foo {
  public string FirstName { get; set; }
  public string LastName { get; set; }
}

class Bar {
  public string FullName { get; set; }
}
```
These objects are not going to map one-to-one, but we can use a PreCondition in our AutoMapper configuration to map `FirstName` and `LastName` to `FullName` only if both properties (`FirstName`, `LastName`) are set. (Yes, we lose data in the case of one of them not being set, this is really a contrived example to just talk about using a PreCondition.)

To do that, we need to setup the PreCondition in our CreateMap like so:
```csharp
CreateMap<Foo, Bar>()
  .ForMember(dest => dest.FullName, opt => {
    opt.PreCondition(src => !string.IsNullOrWhiteSpace(src.FirstName) && !string.IsNullOrWhiteSpace(src.LastName));
    opt.MapFrom(src => string.Format("{0} {1}", src.FirstName, src.LastName));
  });
```

When mapping from `Foo` to `Bar` objects now, the `FullName` property on `Bar` will only be set if `FirstName` and `LastName` are not null or whitespace on `Foo`.  This makes mapping objects a whole lot cleaner once you realize you can do this in your map configuration instead of in your code.

There is also the ability to specify [Conditional Mapping](https://docs.automapper.org/en/stable/Conditional-mapping.html#conditional-mapping) similar to PreCondition that works if properties have the same name it will only map them if the Condition is true.