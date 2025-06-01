//Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, Tooltip } from "@mui/material";
import { MdLockOutline } from "react-icons/md";
import { BsAspectRatio } from "react-icons/bs";

type PanelsProp = {
  selectedLayerId: string;
  layers: Layer[];
};

const ArrangePanel: React.FC<PanelsProp> = () => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <Label className="font-medium">Root size</Label>
        <div className="gap-y-2 grid grid-cols-[30%_70%] grid-rows-2">
          <p className="flex items-center text-sm">Width:</p>
          <Input
            className="bg-mountain-50 border rounded-lg w-full h-12 placeholder:text-mountain-600"
            placeholder="Input Width"
            value="1080 px"
          />

          <p className="flex items-center text-sm">Height:</p>
          <Input
            className="bg-mountain-50 border rounded-lg w-full h-12 placeholder:text-mountain-600"
            placeholder="Input Height"
            value="1080 px"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Tooltip title="Lock Root Layer" arrow placement="left">
          <Button className="flex bg-mountain-50 py-2 border border-mountain-200 w-[25%] font-normal">
            <MdLockOutline className="size-5 text-mountain-600" />
          </Button>
        </Tooltip>
        <Button className="flex bg-mountain-50 py-2 border border-mountain-200 w-[75%] font-normal">
          <BsAspectRatio className="mr-2 size-4" />
          <p>Change Ratio</p>
        </Button>
      </div>
    </>
  );
};

export default ArrangePanel;
