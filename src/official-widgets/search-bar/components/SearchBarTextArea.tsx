import type { FC } from 'react';
import { useContext, memo, useRef } from 'react';
import { Textarea } from '@nextui-org/input';
import { useIntl } from 'react-intl';
import { QUERY_MAX_CHARACTER_LENGTH } from '../../../common/constants';
import type { SearchImage } from '../../../common/types/image';
import ImageGalleryUpload from './ImageGalleryUpload';
import CameraUpload from './CameraUpload';
import { getFile } from '../../../common/utils';
import { WidgetDataContext } from '../../../common/types/contexts';

interface SearchBarTextAreaProps {
  image: SearchImage;
  query: string;
  setQuery: (query: string) => void;
  handleRedirect: () => void;
  setShowDropdown: (showDropdown: boolean) => void;
  setImage: (image: SearchImage) => void;
}

const SearchBarTextArea: FC<SearchBarTextAreaProps> = ({ image, query, setQuery, handleRedirect, setShowDropdown, setImage }) => {
  const { searchBarResultsSettings } = useContext(WidgetDataContext);
  const searchBarRef = useRef<HTMLTextAreaElement>(null);
  const intl = useIntl();

  return (
    <Textarea
      data-pw='sb-search-bar-text-area'
      ref={searchBarRef}
      className='z-30'
      classNames={{
        inputWrapper: 'rounded-md bg-white w-full border border-gray-200',
        input: 'text-mobile-searchBarText md:text-tablet-searchBarText lg:text-desktop-searchBarText font-mobile-searchBarText md:font-tablet-searchBarText '
          + 'lg:font-desktop-searchBarText',
        innerWrapper: 'gap-x-1 md:gap-x-2',
      }}
      autoCapitalize='off'
      autoComplete='off'
      size='lg'
      maxLength={QUERY_MAX_CHARACTER_LENGTH}
      placeholder={intl.formatMessage({ id: 'searchBar.searchBarPlaceholder' })}
      onClick={() => setShowDropdown(true)}
      onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleRedirect();
        }
      }}
      value={query}
      onValueChange={(value) => {
        setQuery(value);
      }}
      startContent={<img src={getFile(image)} className='aspect-[3/4] w-20 rounded-md object-cover md:w-28 lg:w-36'/>}
      endContent={
        searchBarResultsSettings.enableImageUpload
        && <div className='absolute bottom-2 right-2'>
          <ImageGalleryUpload setImage={setImage} />
          <CameraUpload onImageUpload={setImage} />
        </div>
      }
    />
  );
};

export default memo(SearchBarTextArea);
