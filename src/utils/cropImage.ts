export const getCroppedImg = (
    imageSrc: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pixelCrop: any,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height
            const ctx = canvas.getContext('2d')

            if (!ctx) return reject('Failed to get canvas context.')

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height,
            )

            resolve(canvas.toDataURL('image/jpeg'))
        }
        image.onerror = (err) => reject(err)
    })
}
