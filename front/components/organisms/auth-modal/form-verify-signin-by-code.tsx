'use client';
import { Form } from '@heroui/form';
import { InputOtp } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useVerifySignInByCodeForm,
  VerifySignInByCodeSchemaType,
} from './yup-form/signin-by-code.yup';

import MyButton from '@/components/atoms/Button';
import { ResendIcon } from '@/components/atoms/icons';
import { STORAGE_KEYS } from '@/config/constant';
import {
  useResendSignInByCodeMutation,
  useVerifySignInByCodeMutation,
} from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { handleErrFromApi } from '@/shared/helper/validation';
import { useAuthStore } from '@/stores/auth';
import { ModalType, useCommonStore } from '@/stores/common';

interface VerifySignInByCodeFormRef {
  handleSubmit: () => void;
}

interface VerifySignInByCodeFormProps {}

const VerifySignInByCodeForm = forwardRef<
  VerifySignInByCodeFormRef,
  VerifySignInByCodeFormProps
>((props, ref) => {
  const t = useTranslations();
  const { email, setEmail } = useAuthStore();
  const { setIsLoadingConfirm, closeModal } = useCommonStore();
  const { showError, showSuccess } = useSystemToast();
  const [countdown, setCountdown] = useState(0);
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useVerifySignInByCodeForm();

  const formRef = useRef<HTMLFormElement>(null);

  const verifySignInByCodeMutation = useVerifySignInByCodeMutation();
  const resendSignInByCodeMutation = useResendSignInByCodeMutation();

  const isLoadingResend = resendSignInByCodeMutation.isPending;
  const isLoadingVerify = verifySignInByCodeMutation.isPending;

  // Handle submit form
  const onSubmit = async (data: VerifySignInByCodeSchemaType) => {
    handleVerifyCode(data);
  };

  const handleVerifyCode = async (data: VerifySignInByCodeSchemaType) => {
    try {
      setIsLoadingConfirm(true, ModalType.AUTH);

      const res = await verifySignInByCodeMutation.mutateAsync({
        ...data,
        email,
      });

      if (res.access_token) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.GROUP_INVITE_CODE);
        signIn('tokenLogin', {
          ...res,
          redirect: false,
        });
        showSuccess(t('system_message.success.signin_success'));
        closeModal(ModalType.AUTH);
      }
    } catch (error) {
      handleErrFromApi(error, setError, showError, {
        title: t('system_message.error.verify_sign_in_by_code_failed'),
      });
    } finally {
      setIsLoadingConfirm(false, ModalType.AUTH);
    }
  };

  const resendSignInByCode = () => {
    if (isLoadingResend || isLoadingVerify || countdown > 0) return;

    resendSignInByCodeMutation
      .mutateAsync({
        email,
        organization_code: watch('organization_code'),
      })
      .then(() => {
        showSuccess(t('system_message.success.resend_sign_in_by_code_success'));
        setCountdown(300); // 5 minutes = 300 seconds
      })
      .catch((error) => {
        handleErrFromApi(error, setError, showError, {
          title: t('system_message.error.resend_sign_in_by_code_failed'),
        });
      });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const resendText = useMemo(() => {
    if (countdown > 0) {
      return (
        <div className="flex items-center gap-2">
          <span>{formatTime(countdown)}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <ResendIcon className="w-4 h-4" />
      </div>
    );
  }, [countdown]);

  // expose handleSubmit to parent
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      handleSubmit(onSubmit)();
    },
  }));

  // Reset form when unmount
  useEffect(() => {
    setCountdown(300);

    return () => {
      reset();
      setEmail('');
    };
  }, []);

  return (
    <Form
      ref={formRef}
      className="w-full flex flex-col"
      validationBehavior="aria"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="w-full">
        <p className="text-sm ">
          Một mã code đã được gửi tới email của bạn, vui lòng nhập 6 chữ số nhận
          được vào ô bên dưới.
          <br />
          <strong className="text-red-500">
            *Lưu ý mã code chỉ tồn tại trong 5 phút.
          </strong>
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        <InputOtp
          {...register('code')}
          errorMessage={errors.code?.message}
          isInvalid={!!errors.code}
          length={6}
          onComplete={(value) => {
            handleVerifyCode({
              ...watch(),
              code: value,
            });
          }}
        />
        <MyButton
          className="ml-3"
          color="primary"
          disabled={
            (watch('code').length > 0 && watch('code')?.length !== 6) ||
            isLoadingResend ||
            isLoadingVerify ||
            countdown > 0
          }
          isIconOnly={countdown > 0 ? false : true}
          onPress={resendSignInByCode}
        >
          {resendText}
        </MyButton>
      </div>
    </Form>
  );
});

VerifySignInByCodeForm.displayName = 'VerifySignInByCodeForm';

export default VerifySignInByCodeForm;
