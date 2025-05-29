//Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OpacitySlider from '../sliders/OpacitySlider';

//Icons
import { PiFlipHorizontalLight } from "react-icons/pi";
import { PiFlipVerticalLight } from "react-icons/pi";
import { IoDuplicateOutline } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import RotateSlider from '../sliders/RotateSlider';
import LayerPosition from '../sliders/LayerPosition';

type PanelsProp = {
    selectedLayerId: string,
    layers: Layer[],
    handleOpacityChange: (newOpacity: number) => void;
    toggleFlipHorizontal: () => void;
    toggleFlipVertical: () => void;
    handleDuplicate: (layerId: string) => void;
    handleRotationChange: (newRotation: number) => void;
    handleLayerXPosition: (newXPos: number) => void;
    handleLayerYPosition: (newYPos: number) => void;
}

const CropPanel: React.FC<PanelsProp> = ({
    layers,
    selectedLayerId,
    toggleFlipHorizontal,
    toggleFlipVertical,
    handleOpacityChange,
    handleDuplicate,
    handleRotationChange,
    handleLayerXPosition,
    handleLayerYPosition
}) => {
    return (
        <>
            <div className='flex flex-col space-y-2'>
                <Label className='font-medium'>Layer Name</Label>
                <Input className='flex bg-mountain-50 border w-full placeholder:text-mountain-600' placeholder='Input Layer Name' defaultValue="Background" />
            </div>
            <hr className='flex border-mountain-100 border-t-1 w-full' />
            <div className='flex flex-col space-y-2'>
                <Label className='font-medium'>Layer position</Label>
                <div className='flex justify-between gap-x-4'>
                    <LayerPosition
                        label={"X"}
                        position={layers.find(layer => layer.id === selectedLayerId)?.x!}
                        onChange={handleLayerXPosition}
                    />
                    <LayerPosition
                        label={"Y"}
                        position={layers.find(layer => layer.id === selectedLayerId)?.y!}
                        onChange={handleLayerYPosition}
                    />
                </div>
            </div>
            <div className='flex flex-col space-y-2'>
                <OpacitySlider
                    opacity={layers.find(layer => layer.id === selectedLayerId)?.opacity ?? 1}
                    onChange={handleOpacityChange}
                />
            </div>
            <div className='flex flex-col space-y-2'>
                <RotateSlider
                    rotate={layers.find(layer => layer.id === selectedLayerId)?.rotation ?? 0}
                    onChange={handleRotationChange}
                />
            </div>
            <div className='flex space-x-2 w-full'>
                <div onClick={toggleFlipHorizontal} className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <PiFlipHorizontalLight className='flex size-5' />
                </div>
                <div onClick={toggleFlipVertical} className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <PiFlipVerticalLight className='flex size-5' />
                </div>
                <div onClick={() => handleDuplicate(layers[layers.length - 1].id)} className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <IoDuplicateOutline className='flex size-5' />
                </div>
                <div className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <GoTrash className='flex size-5' />
                </div>
            </div>
        </>
    )
}

export default CropPanel