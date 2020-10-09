import React from 'react';
import PropTypes from 'prop-types';
import { Question } from '@styled-icons/octicons/Question';
import { isUndefined } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CardElement, Elements, injectStripe } from 'react-stripe-elements';
import styled from 'styled-components';

import { GQLV2_PAYMENT_METHOD_TYPES } from '../lib/constants/payment-methods';

import { Flex } from './Grid';
import { getI18nLink } from './I18nFormatters';
import StyledCheckbox from './StyledCheckbox';
import StyledTooltip from './StyledTooltip';
import { Span } from './Text';

const StyledCardElement = styled(CardElement)`
  min-width: 200px;
  max-width: 450px;
  max-height: 55px;
  margin: 0px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-image: initial;
  padding: 1rem;
  border-radius: 3px;
`;

StyledCardElement.defaultProps = {
  style: { base: { fontSize: '14px', color: '#313233' } },
};

class NewCreditCardFormWithoutStripe extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    name: PropTypes.string,
    profileType: PropTypes.string, // USER or ORGANIZATION
    error: PropTypes.string,
    hasSaveCheckBox: PropTypes.bool,
    hidePostalCode: PropTypes.bool,
    onChange: PropTypes.func,
    onReady: PropTypes.func,
    stripe: PropTypes.object,
    useLegacyCallback: PropTypes.bool,
  };

  static defaultProps = {
    hasSaveCheckBox: true,
    hidePostalCode: false,
  };

  state = { value: null };

  componentDidMount() {
    if (this.props.onReady && this.props.stripe) {
      this.props.onReady({ stripe: this.props.stripe });
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.onReady && !oldProps.stripe && this.props.stripe) {
      this.props.onReady({ stripe: this.props.stripe });
    }
  }

  getProfileType = () => {
    const { profileType } = this.props;
    if (!profileType) {
      return '';
    } else if (profileType === 'INDIVIDUAL') {
      return 'user';
    } else {
      return profileType.toLowerCase();
    }
  };

  onCheckboxChange = e => {
    if (this.props.useLegacyCallback) {
      this.props.onChange(e);
    } else {
      this.setState(
        ({ value }) => ({ value: { ...value, isSavedForLater: e.checked } }),
        () => this.props.onChange(this.state.value),
      );
    }
  };

  onCardChange = e => {
    if (this.props.useLegacyCallback) {
      this.props.onChange({ name, type: 'StripeCreditCard', value: e });
    } else {
      this.setState(
        ({ value }) => ({
          value: {
            ...value,
            type: GQLV2_PAYMENT_METHOD_TYPES.CREDIT_CARD,
            isSavedForLater: isUndefined(value?.isSavedForLater) || value.isSavedForLater ? true : false,
            stripeData: e,
          },
        }),
        () => this.props.onChange(this.state.value),
      );
    }
  };

  render() {
    const { error, hasSaveCheckBox, hidePostalCode } = this.props;
    return (
      <Flex flexDirection="column">
        <StyledCardElement
          hidePostalCode={hidePostalCode}
          onChange={this.onCardChange}
          onReady={input => input.focus()}
        />
        {error && (
          <Span display="block" color="red.500" pt={2} fontSize="10px">
            {error}
          </Span>
        )}
        {hasSaveCheckBox && (
          <Flex mt={3} alignItems="center" color="black.700">
            <StyledCheckbox
              defaultChecked
              name="save"
              onChange={this.onCheckboxChange}
              label={<FormattedMessage id="paymentMethod.save" defaultMessage="Remember this payment method" />}
            />
            &nbsp;&nbsp;
            <StyledTooltip
              content={() => (
                <Span fontWeight="normal">
                  <FormattedMessage
                    id="ContributeFAQ.Safe"
                    defaultMessage="Open Collective doesn't store any credit card number, we're instead relying on our partner Stripe - a secure solution that is widely adopted by the industry. If our systems are compromised, we can't loose your credit card number because we simply don't have it. <LearnMoreLink>Learn more</LearnMoreLink> about the security of Open Collective."
                    values={{
                      LearnMoreLink: getI18nLink({
                        openInNewTab: true,
                        href: 'https://docs.opencollective.com/help/product/security#payments-security',
                      }),
                    }}
                  />
                </Span>
              )}
            >
              <Question size="1.1em" />
            </StyledTooltip>
          </Flex>
        )}
      </Flex>
    );
  }
}

const NewCreditCardFormWithStripe = injectStripe(NewCreditCardFormWithoutStripe);

const NewCreditCardForm = props => (
  <Elements locale={props.intl.locale || 'en'}>
    <NewCreditCardFormWithStripe {...props} />
  </Elements>
);

NewCreditCardForm.propTypes = {
  intl: PropTypes.object,
  useLegacyCallback: PropTypes.bool,
};

NewCreditCardForm.defaultProps = {
  useLegacyCallback: true,
};

export default injectIntl(NewCreditCardForm);
