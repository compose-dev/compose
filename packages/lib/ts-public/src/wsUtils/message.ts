function getBufferFromJson(data: any) {
  const jsonBuffer = new TextEncoder().encode(JSON.stringify(data));
  return jsonBuffer;
}

/**
 * Simulates a JSON transfer over a WebSocket connection. Used for
 * testing purposes.
 */
function simulateJSONTransfer<T>(data: T): T {
  const jsonBuffer = getBufferFromJson(data);
  const text = new TextDecoder().decode(jsonBuffer);
  return JSON.parse(text) as T;
}

function stringToBinary(str: string) {
  return new TextEncoder().encode(str);
}

function combineBuffers(...buffers: Uint8Array[]): Uint8Array {
  const combinedBuffer = new Uint8Array(
    buffers.reduce((acc, buffer) => acc + buffer.length, 0)
  );
  let offset = 0;
  for (const buffer of buffers) {
    combinedBuffer.set(buffer, offset);
    offset += buffer.length;
  }
  return combinedBuffer;
}

function generateBinaryWSMessage(headerString: string, data: Uint8Array) {
  const headerBuffer = stringToBinary(headerString);
  const combinedBuffer = combineBuffers(headerBuffer, data);

  return combinedBuffer;
}

function numToFourByteBinary(num: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, num, false); // false for big-endian
  return new Uint8Array(buffer);
}

export {
  getBufferFromJson,
  simulateJSONTransfer,
  generateBinaryWSMessage as generateBinary,
  stringToBinary,
  numToFourByteBinary,
  combineBuffers,
};
