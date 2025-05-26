import {
  ImportDeclarationStructure,
  SourceFile,
  StructureKind,
  Type,
  VariableDeclarationKind,
} from 'ts-morph';
import { Injectable } from '@nestjs/common';
import {
  SourceFileImportsMap,
  ProcedureGeneratorMetadata,
} from '../interfaces/generator.interface';
import * as path from 'node:path';
import { ProcedureType } from '../trpc.enum';

@Injectable()
export class StaticGenerator {
  public generateStaticDeclaration(sourceFile: SourceFile): void {
    sourceFile.addImportDeclaration({
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: '@trpc/server',
      namedImports: ['initTRPC'],
    });
    sourceFile.addImportDeclaration({
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: 'zod',
      namedImports: ['z'],
    });

    sourceFile.addVariableStatements([
      {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [{ name: 't', initializer: 'initTRPC.create()' }],
      },
      {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [{ name: 'publicProcedure', initializer: 't.procedure' }],
      },
    ]);
  }

  public addProcedureSpecificImports(
    sourceFile: SourceFile,
    procedures: Array<ProcedureGeneratorMetadata>,
  ): void {
    let needsZAsyncIterable = false;

    for (const proc of procedures) {
      const firstDecorator = proc.decorators[0];
      if (firstDecorator) {
        if (
          (firstDecorator.arguments.input &&
            firstDecorator.arguments.input.includes('zAsyncIterable')) ||
          (firstDecorator.arguments.output &&
            firstDecorator.arguments.output.includes('zAsyncIterable'))
        ) {
          needsZAsyncIterable = true;
        }
      }
    }

    if (needsZAsyncIterable) {
      const relativePath = '../zAsyncIterable';
      sourceFile.addImportDeclaration({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: relativePath,
        namedImports: ['zAsyncIterable'],
      });
    }
  }

  public addSchemaImports(
    sourceFile: SourceFile,
    schemaImportNames: Array<string>,
    importsMap: Map<string, SourceFileImportsMap>,
  ): void {
    const importDeclarations: ImportDeclarationStructure[] = [];

    for (const schemaImportName of schemaImportNames) {
      for (const [importMapKey, importMapMetadata] of importsMap.entries()) {
        if (schemaImportName == null || importMapKey !== schemaImportName) {
          continue;
        }

        const relativePath = path.relative(
          path.dirname(sourceFile.getFilePath()),
          importMapMetadata.sourceFile.getFilePath().replace(/\.ts$/, ''),
        );

        importDeclarations.push({
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: relativePath.startsWith('.')
            ? relativePath
            : `./${relativePath}`,
          namedImports: [schemaImportName],
        });
      }
    }

    sourceFile.addImportDeclarations(importDeclarations);
  }

  public findCtxOutProperty(type: Type): string | undefined {
    const typeText = type.getText();
    const ctxOutMatch = typeText.match(/_ctx_out:\s*{([^}]*)}/);

    return ctxOutMatch ? ctxOutMatch[1].trim() : undefined;
  }
}
