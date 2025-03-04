/**
 * Get the dimensions of a rectangle after it has been rotated by a given angle.
 *
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 * @param angleInDegrees - The angle to rotate the rectangle by, in degrees.
 * @returns The new dimensions of the rectangle.
 */
function getRotatedDimensions(
  width: number,
  height: number,
  angleInDegrees: number
) {
  const angleInRadians = angleInDegrees * (Math.PI / 180); // Convert degrees to radians

  const newWidth =
    Math.abs(width * Math.cos(angleInRadians)) +
    Math.abs(height * Math.sin(angleInRadians));
  const newHeight =
    Math.abs(width * Math.sin(angleInRadians)) +
    Math.abs(height * Math.cos(angleInRadians));

  return { newWidth, newHeight };
}

export { getRotatedDimensions };
