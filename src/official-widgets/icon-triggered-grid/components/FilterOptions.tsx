import type { ChangeEvent, FC, FormEvent, ReactElement } from 'react';
import { useMemo, memo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { cn } from '@nextui-org/theme';
import type { ScreenType } from '../icon-triggered-grid';
import type { ProcessedProduct } from '../../../common/types/product';
import LeftChevronIcon from '../../../common/icons/LeftChevronIcon';
import type { PriceFilter } from '../../../common/types/filter';

/**
 * A component for selecting and applying product result filtering options.
 */

interface FilterOptionsProps {
  className: string;
  productResults: ProcessedProduct[];
  categorySet: Set<string>;
  priceFilter: PriceFilter | null;
  setPriceFilter: (priceRange: PriceFilter) => void;
  categoryFilter: Set<string>;
  setCategoryFilter: (categoryFilter: Set<string>) => void;
  setScreen: (screen: ScreenType | null) => void;
}

const FilterOptions: FC<FilterOptionsProps> = ({
  className,
  categorySet,
  priceFilter,
  setPriceFilter,
  categoryFilter,
  setCategoryFilter,
  setScreen,
}): ReactElement => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(categoryFilter);
  const [minPrice, setMinPrice] = useState(priceFilter?.minPrice?.toString());
  const [maxPrice, setMaxPrice] = useState(priceFilter?.maxPrice?.toString());

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = new Set(prev);
      if (event.target.checked) {
        newSelectedCategories.add(event.target.value);
      } else {
        newSelectedCategories.delete(event.target.value);
      }
      return newSelectedCategories;
    });
  };

  const getCategoryTitleCase = (category: string): string => {
    const categoryLowerCase = category.toLowerCase();
    return categoryLowerCase.charAt(0).toUpperCase() + categoryLowerCase.slice(1);
  };

  const isPriceInvalid = useMemo(() => {
    if (minPrice === '' || maxPrice === '') return false;
    return Number(minPrice) > Number(maxPrice);
  }, [minPrice, maxPrice]);

  // Only allow numbers to be typed into price input
  const handlePriceInputChange = (event: FormEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    if (!Number(value)) {
      event.currentTarget.value = value.slice(0, -1);
    }
  };

  return (
    <div className={cn('bg-primary', className)}>
      <div className='primary-text py-3 text-center lg:py-0 lg:text-start'>Filter</div>
      <div className='flex h-full flex-col gap-2 overflow-y-auto border-1'>
        <Accordion className='divide-y-1 px-0'>
          {/* Price Filter */}
          <AccordionItem
            className='cursor-pointer px-4'
            classNames={{ content: 'py-0 flex justify-center' }}
            key='price'
            title='Price'
            indicator={({ isOpen }) => (isOpen ? <LeftChevronIcon className='size-4 -rotate-90'/> : <LeftChevronIcon className='size-4'/>)}
          >
            <div className='mb-4 flex w-full gap-4'>
              <Input
                className='w-1/2'
                variant='flat'
                label='Min price'
                size='md'
                placeholder='Enter minimum price'
                onInput={handlePriceInputChange}
                value={minPrice}
                min={0}
                onValueChange={setMinPrice}
                labelPlacement='outside'
                isInvalid={isPriceInvalid}
                errorMessage={'Min price must be less than max price'}
                startContent={<span className='text-small text-default-400'>$</span>}
              />
              <Input
                className='w-1/2'
                variant='flat'
                label='Max price'
                size='md'
                placeholder='Enter maximum price'
                onInput={handlePriceInputChange}
                value={maxPrice}
                min={0}
                onValueChange={setMaxPrice}
                labelPlacement='outside'
                isInvalid={isPriceInvalid}
                errorMessage={'Max price must be more than min price'}
                startContent={<span className='text-small text-default-400'>$</span>}
              />
            </div>
          </AccordionItem>

          {/* Category Filter */}
          <AccordionItem
            className='cursor-pointer px-4'
            classNames={{ content: 'py-0' }}
            key='category'
            title='Category'
            indicator={({ isOpen }) => (isOpen ? <LeftChevronIcon className='size-4 -rotate-90'/> : <LeftChevronIcon className='size-4'/>)}
          >
            <div className='flex flex-col gap-2 px-4 pb-4'>
              {Array.from(categorySet).map((category) => (
                <label key={category} className='cursor-pointer'>
                  <input className='mr-2' type='checkbox' value={category} checked={selectedCategories.has(category)} onChange={handleCheckboxChange}/>
                  {getCategoryTitleCase(category)}
                </label>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Cancel & Apply buttons */}
      <div className='flex justify-around py-2 lg:ml-auto lg:justify-normal lg:gap-4 lg:py-0'>
        <Button className='rounded border bg-white px-14 text-black' radius='none' onClick={() => setScreen(null)}>
          Cancel
        </Button>
        <Button className='rounded border bg-buttonPrimary px-14 text-white' radius='none' onClick={() => {
          if (!isPriceInvalid) {
            setPriceFilter({ minPrice: Number(minPrice) || null, maxPrice: Number(maxPrice) || null });
          }
          setCategoryFilter(selectedCategories);
          setScreen(null);
        }}
        >
          <span className='text-buttonPrimary'>Apply</span>
        </Button>
      </div>
    </div>
  );
};

export default memo(FilterOptions);
