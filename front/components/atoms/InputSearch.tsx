import { forwardRef, InputProps } from '@heroui/react';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { ChangeEvent, Ref, useCallback } from 'react';

import { SearchIcon } from './icons';
import MyInput from './Input';

interface InputSearchProps extends InputProps {
  placeholder?: string;
  onChangeDebounce?: (
    keyword: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => void;
}

const InputSearch = forwardRef(
  (props: InputSearchProps, ref: Ref<HTMLInputElement>) => {
    const t = useTranslations();
    const {
      placeholder = t('common.search_placeholder'),
      classNames,
      onChangeDebounce,
      ...rest
    } = props;

    const debouncedUpdateSearch = useCallback(
      debounce((keyword: string, e: ChangeEvent<HTMLInputElement>) => {
        onChangeDebounce?.(keyword, e);
      }, 300),
      [onChangeDebounce],
    );

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;

      debouncedUpdateSearch(keyword, e);
    };

    const startContent = <SearchIcon className="h-6 w-6 text-primary mr-2" />;

    return (
      <MyInput
        startContent={startContent}
        {...props}
        ref={ref}
        classNames={classNames}
        placeholder={placeholder}
        onChange={onChange}
      />
    );
  },
);

InputSearch.displayName = 'InputSearch';

export default InputSearch;
