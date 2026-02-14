import Button from '@app/components/Common/Button';
import defineMessages from '@app/utils/defineMessages';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';

const messages = defineMessages('components.Login', {
  loginwithsso: 'Login with SSO',
  signinButton: 'Use SSO',
});

const OIDCLogin = () => {
  const intl = useIntl();

  const handleOidcLogin = async () => {
    window.location.assign('/api/v1/auth/oidc');
  };

  return (
    <div>
      <h2 className="-mt-1 mb-6 text-center text-lg font-bold text-neutral-200">
        {intl.formatMessage(messages.loginwithsso)}
      </h2>

      <Button
        buttonType="primary"
        onClick={handleOidcLogin}
        data-testid="oidc-signin-button"
        className="w-full shadow-sm"
      >
        <ArrowLeftOnRectangleIcon />
        {intl.formatMessage(messages.signinButton)}
      </Button>
    </div>
  );
};

export default OIDCLogin;
