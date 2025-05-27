import { useEffect, useState } from 'react'

//Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

//Assets
import { MockModelOptionsData } from '../../mock/Data';

//Icons
import { IoIosArrowForward } from "react-icons/io";
import { Button } from '@mui/material';
import { Input } from '@/components/ui/input';
import StyleOption from './StyleOption';

const StyleOptions: React.FC<StyleOptionsProp> = ({ style, selectStyle }) => {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedStyle, setSelectedStyle] = useState<UsedStyle | null>(style);
    const [startIndex, setStartIndex] = useState(0);

    const visibleCount = 3;
    const itemWidth = 88; // 80px + 8px gap
    const baseOffset = 24;

    const handleSelect = (index: number) => {
        setSelectedIndex(index);

        if (index < startIndex) {
            setStartIndex(index); // shift left
        } else if (index > startIndex + visibleCount - 1) {
            setStartIndex(index - visibleCount + 1); // shift right
        }
    };

    const translateValue = -(startIndex * itemWidth) + baseOffset;

    const SelectSelectedStyle = (style: UsedStyle) => {
        selectStyle(style);
        setOpen(false);
    }

    useEffect(() => {
        setSelectedStyle(style);
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='flex justify-between bg-mountain-100 p-3 rounded-xl w-full font-normal'>
                    <div className='flex items-center space-x-2'>
                        <img src={style.images[0]} loading="lazy" className='rounded-xs w-5 h-5' />
                        <p>{style.name}</p>
                    </div>
                    <IoIosArrowForward />
                </Button>
            </DialogTrigger>
            <DialogContent className='gap-0 space-y-0 bg-white p-0 border-0 rounded-xl min-w-5xl'>
                <DialogHeader className='p-4 border-mountain-200 border-b-[1px]'>
                    <DialogTitle className='font-normal text-mountain-700'>Styles</DialogTitle>
                    <DialogDescription hidden>Image Description</DialogDescription>
                </DialogHeader>
                <div className='relative flex w-full h-[600px]'>
                    <div className='flex flex-col space-y-4 p-4 border-mountain-200 border-r-[1px] w-[717px]'>
                        <div className='flex justify-end items-end'>
                            <Input autoFocus={false} className='bg-mountain-50 w-64 placeholder:text-mountain-400' placeholder='Search styles' />
                        </div>

                        <div
                            className="
                                grid
                                grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]
                                gap-4
                                overflow-y-auto
                                h-[500px]
                            "
                        >
                            {MockModelOptionsData.map((style) => (
                                <StyleOption
                                    key={style.name}
                                    style={style}
                                    isSelected={style === selectedStyle}
                                    onClick={() => setSelectedStyle(style)}
                                />
                            ))}
                        </div>

                    </div>
                    <div className='flex flex-col items-start space-y-4 py-4 border-mountain-200 w-[307px] overflow-hidden'>
                        <div className='flex justify-center w-full'>
                            <div className='flex w-64 h-64'>
                                <img loading="lazy" src={selectedStyle?.images[selectedIndex]} className='rounded-xl w-fit h-auto object-cover' />
                            </div>
                        </div>
                        <div className='flex flex-col px-6 w-full'>
                            <p className='flex mb-1 w-full font-medium'>{selectedStyle?.name}</p>
                            <span className='text-mountain-600 text-xs'>{selectedStyle?.description}</span>
                        </div>
                        <div className='flex flex-col justify-between w-full h-full'>
                            <div>
                                <p className='flex mb-1 px-6 w-full font-medium'>Sample Results</p>
                                <div className='flex space-x-2 w-[500px] duration-300 ease-in-out overflow-x-auto'
                                    style={{ transform: `translateX(${translateValue}px)` }}
                                >
                                    {selectedStyle?.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex w-20 h-20 cursor-pointer transform duration-200 ease-in-out rounded-xl ${selectedIndex === idx ? 'border-4 border-black' : ''}`}
                                            onClick={() => {
                                                handleSelect(idx);
                                            }}
                                        >
                                            <img src={img} loading="lazy" className="rounded-lg w-fit h-auto object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex px-6' onClick={() => SelectSelectedStyle(selectedStyle!)}>
                                <Button className='flex justify-center items-center bg-indigo-200 w-full'>Use This Style</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default StyleOptions