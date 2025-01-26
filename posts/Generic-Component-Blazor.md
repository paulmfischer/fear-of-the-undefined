---
layout: layouts/posts.tsx
title: "Generic Components in Blazor"
date: 2019-06-21T05:00:00Z
categories:
  - dotnet
tags:
  - blazor
  - generics
description: Explore building a generic component with Blazor.
---
Continuing on my Blazor exploration, today I am exploring building a generic component.  I started out building an autocomplete component for a single entity.  It works great for the single entity `PublisherViewModel` but it does me no good if I want to have an autocomplete for another entity like `AuthorViewModel`.

So lets first look at the non-generic autocomplete component (`Autocomplete.razor`):
```csharp
@using MediaSet.Shared

<div class="autocomplete" @onblur="@LostFocus">
    <label for="search">Search Publishers</label>
    <InputText id="Search" Class="form-control" @bind-Value="@SearchValue" @oninput="@FilterResults" @onfocus="@Focused" />
    @if (DisplayResults)
    {
        <div class="list-group">
            @foreach (var item in FilteredCollection(SearchValue))
            {
                <button type="button" class="list-group-item list-group-item-action" @onclick="@(async (e) => await SetSelectedItem(item))">
                    @item.Name
                </button>
            }
        </div>
    }
</div>

@code {
    [Parameter]
    private IEnumerable<PublisherViewModel> Publishers { get; set; }

    [Parameter]
    private EventCallback<PublisherViewModel> OnItemSelected { get; set; }

    private string SearchValue { get; set; }
    private bool DisplayResults { get; set; } = false;

    private void FilterResults(UIChangeEventArgs ev)
    {
        SearchValue = (string)ev.Value;
    }

    private void Focused()
    {
        DisplayResults = true;
    }

    private void LostFocus()
    {
        DisplayResults = false;
    }

    private IEnumerable<PublisherViewModel> FilteredCollection(string searchVal)
    {
        return Publishers.Select(x => new PublisherViewModel {
            Id = x.Id,
            Name = x.Name
        }).Where(x => string.IsNullOrEmpty(searchVal) || x.Name.Contains(searchVal));
    }

    private async Task SetSelectedItem(PublisherViewModel itemSelected)
    {
        SearchValue = itemSelected.Name;
        DisplayResults = false;
        await OnItemSelected.InvokeAsync(itemSelected);
        base.StateHasChanged();
    }
}
```

The non-generic part about this auto complete that we need to pull out is the `PublisherViewModel`.  To do that we need to specify a type parameter.  In Blazor, we specify a type parameter for the component at the top of the component like so:

```csharp
@typeparam TEntity
```

Now we can start to use that type parameter throughout the component and make the component a generic component.
There are a few things we need to change, for one, we need to update the signature of `FilteredCollection` like so

```csharp
private IEnumerable<selectitem> FilteredCollection(string searchVal)
```

You will notice that it now returns `IEnumerable<SelectItem>` instead of `IEnumerable<TEntity>`. Internally to the autocomplete I am creating a new class like so:

```csharp
private class SelectItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public TItem Item { get; set; }
}
```

I am doing this mainly because I am doing the filtering inside the autocomplete. To truly make this generic, we could remove the filtering so the autocomplete cares nothing at all about the types but I wanted to make this a simple autocomplete that doesn't require a lot of extra code to make work. The other reason I created an internal class is because this version of Blazor that I am using (v3 preview 6) we cannot put a type constraint on our generic type. If we could use type constraints then we could enforce the collections of objects would have to be of an interface or abstract class that defines a few properties to be used in the autocomplete like so:

```csharp
public class IEntity
{
    int Id { get; set; }
    string Name { get; set; }
}
```

This would then make our filter logic easier to work with since we wouldn't need an internal class and we also would not have to use reflection to get to the properties.  There are a few other adjustments to be made such as making the search label an input `Parameter`, using a `RenderFragment` for the text in the autocomplete result list.  And then the last thing is to return the actual `TEntity` item on selection.

So our new generic autocomplete component looks like the following:

```csharp
@typeparam TEntity

<div class="autocomplete" @onblur="@LostFocus">
    <label for="search">@Title</label>
    <InputText id="Search" Class="form-control" @bind-Value="@SearchValue" @oninput="@FilterResults" @onfocus="@Focused" />
    @if (DisplayResults)
    {
        <div class="list-group">
            @foreach (var item in FilteredCollection(SearchValue))
            {
                <button type="button" class="list-group-item list-group-item-action" @onclick="@(async (e) => await SetSelectedItem(item))">@ItemTemplate(item.Item)</button>
            }
        </div>
    }
</div>

@code {
    [Parameter]
    private string Title { get; set; } = "Search:";

    [Parameter]
    RenderFragment<TEntity> ItemTemplate { get; set; }

    [Parameter]
    private IEnumerable<TEntity> Collection { get; set; }

    [Parameter]
    private EventCallback<TEntity> OnItemSelected { get; set; }

    private string SearchValue { get; set; }
    private bool DisplayResults { get; set; } = false;

    private void FilterResults(UIChangeEventArgs ev)
    {
        SearchValue = (string)ev.Value;
    }

    private void Focused()
    {
        DisplayResults = true;
    }

    private void LostFocus()
    {
        DisplayResults = false;
    }

    private IEnumerable<SelectItem> FilteredCollection(string searchVal)
    {
        return Collection.Select(x => new SelectItem {
            Id = (int)x.GetType().GetProperty("Id")?.GetValue(x, null),
            Name = (string)x.GetType().GetProperty("Name")?.GetValue(x, null),
            Item = x
        }).Where(x => string.IsNullOrEmpty(searchVal) || x.Name.Contains(searchVal));
    }

    private async Task SetSelectedItem(SelectItem itemSelected)
    {
        SearchValue = itemSelected.Name;
        Value = itemSelected.Item;
        DisplayResults = false;
        await OnItemSelected.InvokeAsync(itemSelected.Item);
        base.StateHasChanged();
    }

    private class SelectItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TEntity Item { get; set; }
    }
}
```

So that is the transformation I made to a component built for a single entity to a generic component.  There are some additional things I could of added like server side filtering, the ability to add a new value that is not in the results list.  But I will leave that for another day.