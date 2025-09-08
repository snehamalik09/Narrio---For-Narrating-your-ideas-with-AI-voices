// utils/base64ToBlob.ts (or inside the same file if you prefer)
export function base64ToBlob(base64: string, mimeType: string) {
    // If base64 has a prefix like "data:audio/wav;base64,...", remove it
    const cleanedBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    const byteCharacters = atob(cleanedBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: mimeType });
    console.log("Created blob:", blob);
    return blob;
}
