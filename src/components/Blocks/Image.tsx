import Image from "next/image";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";

import { ImageBlock as ImageBlockType } from "@/types";
import { api } from "../../../convex/_generated/api";
import { DraggableResizablePosition } from "../../modules/core/foundation";

export interface ImageProps {
  canvasBlock: ImageBlockType;
}

export default function ImageBlock({ canvasBlock }: ImageProps) {
  const { storageId } = canvasBlock;
  const mutation = useMutation(api.upload.getImageUrl);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchImageUrl = useCallback(async () => {
    const url = await mutation({ storageId });
    setImageUrl(url);
  }, [mutation, storageId]);

  useEffect(() => {
    fetchImageUrl();
  }, [fetchImageUrl]);

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
        <Image
          src={imageUrl}
          alt="Image Block"
          width={canvasBlock.width}
          height={canvasBlock.height}
          //className="object-cover"
          className="object-cover w-full h-full"
        />
      ) : null}
    </DraggableResizablePosition>
  );
}
