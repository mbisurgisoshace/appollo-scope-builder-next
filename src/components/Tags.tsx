import { Badge } from "./ui/badge";

interface TagsProps {
  tags: string[];
}

export default function Tags({ tags }: TagsProps) {
  return (
    <>
      {tags.length > 0 && (
        <Badge className="absolute top-[-50px] left-2 z-[100]">
          {tags.join(" - ")}
        </Badge>
      )}
    </>
  );
}
