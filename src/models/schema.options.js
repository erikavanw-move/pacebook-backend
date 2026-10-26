function transform(doc, ret) {
  if (!ret._id) return ret;
  const { _id, ...rest } = ret;
  return { id: _id.toString(), ...rest };
}

export const baseSchemaOptions = {
  versionKey: false,
  toObject: { transform },
  toJSON: { transform },
};
