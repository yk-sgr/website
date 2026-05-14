---
title: The cost of clever
pubDate: 2026-05-12
---

Every clever piece of code is a loan against your future attention.

When I read something in our codebase that makes me pause &mdash; a metaprogramming trick, a chain of generics, a custom DSL nestled inside a config &mdash; I&rsquo;ve learned to ask one question before I admire it: how often will someone need to read this without time to understand it?

Cleverness compounds in two directions. The good direction is leverage: a small abstraction that pays for itself across a hundred call sites. The bad direction is friction: an abstraction whose readers all have to load its private vocabulary into their head before they can do anything.

The deciding factor is rarely the abstraction itself. It&rsquo;s how often it gets touched in a hurry.

```ts
// Looks clever. Costs a meeting every time someone new joins.
type Result<T, E> = Readonly<
  | { ok: true; value: T }
  | { ok: false; error: E }
>;
```

Code you write at 11am on a Tuesday gets read at 4pm on a Friday, by someone who didn&rsquo;t write it, while a customer is waiting. That&rsquo;s the audience. Plan for them.

I&rsquo;m not arguing against abstraction. I&rsquo;m arguing for being honest about who&rsquo;s going to pay for it &mdash; and when.
