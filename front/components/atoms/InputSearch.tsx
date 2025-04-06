import { forwardRef, InputProps } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Ref } from 'react';

import { SearchIcon } from './icons';
import MyInput from './Input';

interface InputSearchProps extends InputProps {
  placeholder?: string;
}

const InputSearch = forwardRef(
  (props: InputSearchProps, ref: Ref<HTMLInputElement>) => {
    const tCommon = useTranslations('common');

    const {
      placeholder = tCommon('search_placeholder'),
      classNames = {
        mainWrapper: 'min-w-[320px] max-w-[440px]',
        input: 'placeholder:text-primary-200',
        inputWrapper: 'rounded-[32px]',
      },
      ...rest
    } = props;
    const startContent = <SearchIcon className="h-6 w-6 text-primary mr-2" />;

    return (
      <MyInput
        {...props}
        ref={ref}
        classNames={classNames}
        placeholder={placeholder}
        startContent={startContent}
      />
    );
  },
);

InputSearch.displayName = 'InputSearch';

export default InputSearch;
