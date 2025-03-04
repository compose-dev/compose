function getStaleStateKey({
  renderId,
  componentId,
}: {
  renderId: string;
  componentId: string;
}): string {
  return `${renderId}.${componentId}`;
}

export { getStaleStateKey };
