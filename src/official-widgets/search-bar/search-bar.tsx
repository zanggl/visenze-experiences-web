import type { ReactElement } from 'react';
import { useEffect, useContext, useState } from 'react';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { cn } from '@nextui-org/theme';
import { RootContext } from '../../common/components/shadow-wrapper';
import type { SearchImage } from '../../common/types/image';
import MagnifyingGlassIcon from '../../common/icons/MagnifyingGlassIcon';
import SearchBarInput from './components/SearchBarInput';
import SearchBarTextArea from './components/SearchBarTextArea';
import useAutocomplete from '../../common/components/hooks/use-autocomplete';
import { getFile } from '../../common/utils';

const SearchBar = (): ReactElement => {
  const [searchBarQuery, setSearchBarQuery] = useState('');
  const [searchImage, setSearchImage] = useState<SearchImage | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const root = useContext(RootContext);

  const {
    autocompleteResults,
    error,
  } = useAutocomplete({
    image: searchImage,
    query: searchBarQuery,
  });

  const handleRedirect = (): void => {
    if (searchBarQuery) {
      localStorage.setItem('visenze-search-bar-query', searchBarQuery);
      if (searchImage) {
        localStorage.setItem('visenze-search-bar-image', getFile(searchImage));
      }

      const reloadEmbeddedSearchResultsEvent = new CustomEvent('reload-embedded-search-results');
      document.dispatchEvent(reloadEmbeddedSearchResultsEvent);

      // Redirect to page with embedded search results
      window.location.href = `${window.location.origin}/search-results`;
    }
  };

  document.addEventListener('add-image-to-search-bar', (e) => {
    console.log('event received');
    setSearchImage({ imgUrl: (e as any).detail.im_url });
  });

  useEffect(() => {
    if (!searchBarQuery) setShowDropdown(false);
    else setShowDropdown(true);
  }, [searchBarQuery]);

  if (!root || error) {
    if (error) console.error(error);
    return <></>;
  }

  return (
    <>
      <div className='flex size-full flex-col bg-primary'>
        <div className='relative flex w-full flex-col items-center'>
          {/* Search bar */}
          {
            searchImage
            ? <SearchBarTextArea image={searchImage} searchBarValue={searchBarQuery} setSearchBarValue={setSearchBarQuery} setImage={setSearchImage}
                                 handleRedirect={handleRedirect} setShowDropdown={setShowDropdown} />
            : <SearchBarInput searchBarValue={searchBarQuery} setSearchBarValue={setSearchBarQuery} setImage={setSearchImage}
                              handleRedirect={handleRedirect} setShowDropdown={setShowDropdown} />
          }

          {/* Autocomplete dropdown */}
          {
            <Listbox
              onAction={(key) => { setSearchBarQuery(String(key)); setShowDropdown(false); }}
              classNames={{
                base: cn(
                  'rounded-md max-h-52 w-full overflow-y-auto border-gray-200 bg-white transition-all z-20',
                  showDropdown && autocompleteResults.length > 0 ? 'border-b-1 border-x-1' : 'border-none hidden',
                  searchImage ? 'top-[210px]' : 'top-12',
                ),
              }}
              aria-label='Autocomplete Dropdown'
            >
              <ListboxSection classNames={{ base: 'mb-0' }}>
                {autocompleteResults.map((result, index) => (
                  <ListboxItem
                    tabIndex={0}
                    className='pr-4'
                    key={result}
                    endContent={<MagnifyingGlassIcon className='size-4'/>}
                    textValue={result}
                  >
                    <span className='calls-to-action-text pl-2 text-primary'
                          data-pw={`sb-autocomplete-suggestion-${index + 1}`}>{result}</span>
                  </ListboxItem>
                ))}
              </ListboxSection>
            </Listbox>
          }
        </div>
      </div>
    </>
  );
};

export default SearchBar;
