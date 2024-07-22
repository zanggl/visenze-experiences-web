import type { FC } from 'react';
import { memo, useRef } from 'react';
import { Input } from '@nextui-org/input';
import { useIntl } from 'react-intl';
import { QUERY_MAX_CHARACTER_LENGTH } from '../../../common/constants';
import ImageGalleryUpload from './ImageGalleryUpload';
import type { SearchImage } from '../../../common/types/image';
import MagnifyingGlassIcon from '../../../common/icons/MagnifyingGlassIcon';
import CameraUpload from './CameraUpload';

interface SearchBarInputProps {
  searchBarValue: string;
  setSearchBarValue: (searchBarValue: string) => void;
  handleRedirect: () => void;
  setShowDropdown: (showDropdown: boolean) => void;
  setImage: (image: SearchImage) => void;
}

const SearchBarInput: FC<SearchBarInputProps> = ({ searchBarValue, setSearchBarValue, handleRedirect, setShowDropdown, setImage }) => {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();

  return (
    <Input
      ref={searchBarRef}
      className='z-30'
      classNames={{
        inputWrapper: 'rounded-md bg-white w-full border border-gray-200 px-2',
        input: 'text-mobile-searchBarText md:text-tablet-searchBarText lg:text-desktop-searchBarText font-mobile-searchBarText md:font-tablet-searchBarText '
          + 'lg:font-desktop-searchBarText',
      }}
      autoCapitalize='off'
      autoComplete='off'
      size='lg'
      isClearable
      maxLength={QUERY_MAX_CHARACTER_LENGTH}
      placeholder={intl.formatMessage({ id: 'searchBar.searchBarPlaceholder' })}
      onClick={() => setShowDropdown(true)}
      onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleRedirect();
          if (searchBarRef.current) {
            searchBarRef.current.blur();
          }
        }
      }}
      value={searchBarValue}
      onValueChange={(value) => {
        setSearchBarValue(value);
      }}
      startContent={
        <div className='flex items-center gap-2'>
          <ImageGalleryUpload setImage={setImage} />
          <CameraUpload onImageUpload={setImage} />
          <MagnifyingGlassIcon className='size-4'/>
        </div>
      }
      data-pw='sb-search-bar-input'
    />
  );
};

export default memo(SearchBarInput);
