// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import type {
  FormFieldValue,
  FormSchemaField,
} from '#shared/components/Form/types.ts'
import type {
  EnumObjectManagerObjects,
  ObjectManagerFrontendAttribute,
} from '#shared/graphql/types.ts'
import type { JsonValue } from 'type-fest'

export default abstract class FieldResolver {
  protected name: string

  protected object: EnumObjectManagerObjects

  protected label: string

  protected internal: boolean

  protected attributeType: string

  protected attributeConfig: Record<string, JsonValue>

  abstract fieldType: string | (() => string)

  constructor(
    object: EnumObjectManagerObjects,
    objectAttribute: ObjectManagerFrontendAttribute,
  ) {
    this.object = object
    this.name = objectAttribute.name
    this.label = objectAttribute.display
    this.internal = objectAttribute.isInternal
    this.attributeType = objectAttribute.dataType
    this.attributeConfig = objectAttribute.dataOption
  }

  private getFieldType(): string {
    if (typeof this.fieldType === 'function') {
      return this.fieldType()
    }

    return this.fieldType
  }

  public fieldAttributes(): FormSchemaField {
    const resolvedAttributes: FormSchemaField = {
      type: this.getFieldType(),
      label: this.label,
      name: this.name,
      required: 'null' in this.attributeConfig && !this.attributeConfig.null, // will normally be overriden with the screen config
      internal: this.internal,
      ...this.fieldTypeAttributes(),
    }

    if (this.attributeConfig.default) {
      resolvedAttributes.value = this.attributeConfig.default as FormFieldValue
    }

    return resolvedAttributes
  }

  abstract fieldTypeAttributes(): Partial<FormSchemaField>
}
