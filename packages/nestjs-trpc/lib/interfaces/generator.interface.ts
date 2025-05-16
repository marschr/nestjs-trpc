import {
  ClassDeclaration,
  EnumDeclaration,
  Expression,
  FunctionDeclaration,
  InterfaceDeclaration,
  SourceFile,
  VariableDeclaration,
} from 'ts-morph';

export interface RouterGeneratorMetadata {
  name: string;
  alias?: string;
  procedures: Array<ProcedureGeneratorMetadata>;
}

export interface ProcedureGeneratorMetadata {
  name: string;
  decorators: Array<DecoratorGeneratorMetadata>;
}

/**
 * @deprecated This type is deprecated and will be removed in a future version.
 * Please use the `ProcedureGeneratorMetadata` type instead for more accurate representation.
 */
export type DecoratorMetadatas = Record<
  string, // Procedure method name
  DecoratorGeneratorMetadata[] // Decorators applied to this procedure
>;

export interface DecoratorGeneratorMetadata {
  name: 'Query' | 'Mutation' | 'Subscription';
  arguments: Record<string, string>;
}

export interface SourceFileImportsMap {
  initializer:
    | Expression
    | ClassDeclaration
    | InterfaceDeclaration
    | EnumDeclaration
    | VariableDeclaration
    | FunctionDeclaration;
  sourceFile: SourceFile;
}
