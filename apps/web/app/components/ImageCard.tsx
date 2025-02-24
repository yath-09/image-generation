
export interface TImage {
    id: string;
    status: string;
    imageUrl: string;
}

const DEFAULT_BLUR_IMAGE =
    "https://static.vecteezy.com/system/resources/thumbnails/016/894/217/small/white-background-white-polished-metal-abstract-white-gradient-background-blurred-white-backdrop-illustration-vector.jpg";

export function ImageCard({ id, status, imageUrl }: TImage) {
    const isGenerated = status.toLowerCase() === "generated" && imageUrl!=="";

    return (
        <div className="rounded-xl border-2 max-w-[400px] cursor-pointer flex p-1">
                <img src={isGenerated ? imageUrl : DEFAULT_BLUR_IMAGE} className="rounded w-full" alt="Generated preview" />
        </div>
    );
}

