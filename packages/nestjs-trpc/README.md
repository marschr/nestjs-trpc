# This repo is an attempt to migrate the nestjs-trpc library to tRPC v11. (more info below)


<a href="https://nestjs-trpc.io/" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://i.imgur.com/JvsOXCg.png" />
    <img alt="tRPC" src="https://i.imgur.com/JvsOXCg.png" />
  </picture>
</a>

<div align="center">
  <h1>Nestjs tRPC Adapter</h1>
  <h3>An opinionated approach to building<br />End-to-end typesafe APIs with tRPC within NestJS.</h3>
  <a href="https://npmcharts.com/compare/nestjs-trpc?interval=30">
    <img alt="weekly downloads" src="https://img.shields.io/npm/dm/nestjs-trpc.svg">
  </a>
  <a href="https://github.com/KevinEdry/nestjs-trpc/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/KevinEdry/nestjs-trpc" />
  </a>
  <a href="https://discord.gg/trpc-867764511159091230">
    <img alt="Discord" src="https://img.shields.io/discord/867764511159091230?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <br />
  <figure>
    <img src="https://assets.trpc.io/www/v10/v10-dark-landscape.gif" alt="Demo" />
    <figcaption>
      <p align="center">
        The client above is <strong>not</strong> importing any code from the server, only its type declarations.
      </p>
    </figcaption>
  </figure>
</div>


---
## Migration from tRPC v10 / Upgrading `nestjs-trpc` for tRPC v11 Support

This version of `nestjs-trpc` has been updated to support tRPC v11. The upgrade process involved several key changes and has some important takeaways for users and contributors:

1.  **tRPC v11 Internal Structure:** tRPC v11 refactored its internal structure. Many types previously available via deep imports (`@trpc/server/dist/...`) are no longer accessible or have moved. Rely on the main `@trpc/server` entry point for imports. For types not directly exported, structural typing, `any`, or inference from instances might be needed.

2.  **`ProcedureBuilder` Type:** Importing `ProcedureBuilder` as a named type from `@trpc/server` proved problematic in our build environment. For typing procedure builder instances (e.g., `initTRPC.create().procedure`), using `typeof t.procedure` (where `t` is an `initTRPC` instance from `@trpc/server`) is more robust. In `nestjs-trpc`'s core interfaces, `TRPCPublicProcedure` was ultimately typed as `any` to ensure stability; this is a type safety trade-off.

3.  **Procedure Definition Introspection (`_def.type`):** The internal definition (`_def`) of tRPC procedures has changed. For example, to check a procedure's type, use `_def.type === 'query'` (or `'mutation'`, `'subscription'`) instead of properties like `_def.query` which might have existed in v10.

4.  **`createContext` Options (User Breaking Change):** If you provide a custom context class for `nestjs-trpc`, its `create(opts)` method will now receive an `opts` object that includes an `info: TRPCRequestInfo` property, in addition to `req` and `res`. You must update your context class to accommodate this.

5.  **Router Construction in `nestjs-trpc`:** This library now constructs a single, nested JavaScript object representing the entire router schema. This object is then passed to one top-level `tRPC.router()` call, leveraging tRPC v11's capability to build the router tree from this structure.

6.  **Dependency Version Consistency:** Ensure that your main application and any related examples or packages consistently depend on the same major version of `@trpc/server` (e.g., v11). Mismatched versions can lead to subtle runtime errors.

7.  **Developer Tools (e.g., `trpc-panel`):** External tools that introspect tRPC routers, like `trpc-panel`, may require updates or might not be fully compatible with tRPC v11's router structures yet. Issues with such tools don't necessarily indicate a problem with your core tRPC setup if the API itself is functional.

8.  **Subscription Output Schema Handling:** The code generator for `nestjs-trpc` now correctly processes and includes the `output` Zod schema provided in the `@Subscription` decorator. This ensures that your subscription procedures are generated with the correct output types.

9.  **Flexible Subscription Resolvers:** The generator has been updated to support both tRPC `observable` and `async function*` style resolvers for subscriptions. This aligns with tRPC v11's capabilities and ensures correct runtime behavior for streaming endpoints.

10. **`zAsyncIterable` for Streaming Endpoints:** When defining subscriptions that stream data (e.g., Server-Sent Events), users should specify the output schema using a helper like `zAsyncIterable` directly within the `@Subscription` decorator. For example: `@Subscription({ output: zAsyncIterable({ yield: YourItemSchema }) })`. `nestjs-trpc` will use this schema as provided in the generated code. You will need to ensure `zAsyncIterable` (or your chosen utility) is available in your project and correctly imported. For more details on `zAsyncIterable` and output validation for subscriptions, refer to the [official tRPC documentation](https://trpc.io/docs/server/subscriptions#example-with-zod).

11. **Automatic Imports for Subscriptions:** The main generated tRPC router file (`server.ts` by default) will now automatically include `import { observable } from '@trpc/server/observable';` if your application defines any subscription procedures. Furthermore, if "zAsyncIterable" (case-sensitive) is detected in the string representation of any procedure's input or output arguments within decorators, an attempt will be made to import it (e.g., `import { zAsyncIterable } from '../zAsyncIterable';`). Ensure the path to your `zAsyncIterable` helper is correct relative to your generated files, or adjust the import path in `static.generator.ts` if necessary.

---


## Introduction

**NestJS tRPC** is a library designed to integrate the capabilities of tRPC into the NestJS framework. It aims to provide native support for decorators and implement an opinionated approach that aligns with NestJS conventions.

## Features

- ✅&nbsp; Supports most tRPC features out of the box with more to come.
- 🧙‍&nbsp; Full static typesafety & autocompletion on the client, for inputs, outputs, and errors.
- 🙀&nbsp; Implements the Nestjs opinionated approach to how tRPC works.
- ⚡️&nbsp; Same client-side DX - We generate the AppRouter on the fly.
- 🔋&nbsp; Examples are available in the ./examples folder.
- 📦&nbsp; Out of the box support for **Dependency Injection** within the routes and procedures.
- 👀&nbsp; Native support for `express`, `fastify`, and `zod` with more drivers to come!

## Quickstart

### Installation

To install **NestJS tRPC** with your preferred package manager, you can use any of the following commands:

```shell
# npm
npm install trpc-nestjs zod @trpc/server

# pnpm
pnpm add trpc-nestjs zod @trpc/server

# yarn
yarn add trpc-nestjs zod @trpc/server
```

## How to use

Here's a brief example demonstrating how to use the decorators available in **NestJS tRPC**:

```typescript
// users.router.ts
import { Inject } from '@nestjs/common';
import { Router, Query, UseMiddlewares } from 'trpc-nestjs';
import { UserService } from './user.service';
import { ProtectedMiddleware } from './protected.middleware';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  password: z.string()
})

@Router()
class UserRouter {
  constructor(
    @Inject(UserService) private readonly userService: UserService
  ) {}

  @UseMiddlewares(ProtectedMiddleware)
  @Query({ output: z.array(userSchema) })
  async getUsers() {
    try {
      return this.userService.getUsers();
    } catch (error: unknown) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error has occured when trying to get users.",
        cause: error
      })
    }
  }
}
```

**👉 See full documentation on [NestJS-tRPC.io](https://nestjs-trpc.io/docs). 👈**

## All contributors

> NestJS tRPC is developed by [Kevin Edry](https://twitter.com/KevinEdry), which taken a huge inspiration from both NestJS and tRPC inner workings.

<a href="https://github.com/KevinEdry/nestjs-trpc/graphs/contributors">
  <p align="center">
    <img width="720" height="50" src="https://contrib.rocks/image?repo=kevinedry/nestjs-trpc" alt="A table of avatars from the project's contributors" />
  </p>
</a>

