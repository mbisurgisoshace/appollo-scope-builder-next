import { useMutation } from "convex/react";
import { useEffect, useState } from "react";

import { ImageBlock } from "../../modules/types";
import { api } from "../../../convex/_generated/api";
import { DraggableResizablePosition } from "../../modules/core/foundation";

export interface ImageProps {
  canvasBlock: ImageBlock;
}

export default function Image({ canvasBlock }: ImageProps) {
  const { storageId } = canvasBlock;
  const mutation = useMutation(api.upload.getImageUrl);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImageUrl();
  }, []);

  const fetchImageUrl = async () => {
    const url = await mutation({ storageId });
    setImageUrl(url);
  };

  return (
    <DraggableResizablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      width={canvasBlock.width}
      height={canvasBlock.height}
    >
      {imageUrl ? (
        <img
          style={{
            width: canvasBlock.width,
            height: canvasBlock.height,
          }}
          className="object-cover"
          src={imageUrl}
        />
      ) : null}
    </DraggableResizablePosition>
  );
}
