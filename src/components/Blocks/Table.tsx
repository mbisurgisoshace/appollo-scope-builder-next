import {
  RowData,
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { LiveList } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useRef, useState, useEffect } from "react";

import { DraggablePosition } from "../../modules/core/foundation";
import { CanvasBlock, TableBlock } from "@/types";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export interface TableProps {
  canvasBlock: TableBlock;
}

const columnHelper = createColumnHelper<any>();

const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        onBlur={onBlur}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export default function Table({ canvasBlock }: TableProps) {
  const { colsDefinition } = canvasBlock;
  const ref = useRef<HTMLHeadingElement>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const updateData = useMutation(
    ({ storage }, rowIndex: number, columnId: string, value: any) => {
      const items = storage.get("items") as LiveList<CanvasBlock>;
      const block = items.find(
        (item) => item.id === canvasBlock.id
      ) as TableBlock;
      const blockIndex = items.findIndex((item) => item.id === canvasBlock.id);

      if (block) {
        block.data = block.data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...block.data[rowIndex]!,
              [columnId]: value,
            };
          }
          return row;
        });
        items.set(blockIndex, block);
      }
    },
    []
  );

  const getDimensions = (): { width: number; height: number } => {
    const { width, height } = canvasBlock;

    if (ref.current) {
      return {
        width: Math.max(ref.current.offsetWidth, 0),
        height: Math.max(ref.current.offsetHeight, 0),
      };
    }

    return { width, height };
  };

  const { width, height } = getDimensions();

  const columns = colsDefinition.map((col) => {
    return columnHelper.accessor(col.id, {
      header: col.name,
      //cell: (info) => info.getValue(),
    });
  });

  const table = useReactTable({
    columns,
    meta: {
      updateData,
    },
    defaultColumn,
    state: {
      columnFilters,
    },
    data: canvasBlock.data,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <DraggablePosition
      id={canvasBlock.id}
      top={canvasBlock.top}
      left={canvasBlock.left}
      canvasBlock={canvasBlock}
      // width={canvasBlock.width}
      // height={canvasBlock.height}
      width={width}
      height={height}
    >
      <div
        ref={ref}
        style={{
          minWidth: "min-content",
          minHeight: "min-content",
          width,
          height,
          // width: canvasBlock.width,
          // height: canvasBlock.height,
        }}
        className={`bg-white rounded-xl shadow-2xl relative`}
      >
        <table className="w-full border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b border-r p-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="border-b">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="h-8 border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-r">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DraggablePosition>
  );
}
