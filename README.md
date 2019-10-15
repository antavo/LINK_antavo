# Salesforce Commerce Cloud Cartridge

## Component Overview

### Functional Overview

#### Sending Signed API Requests

#### Authenticating Customers with Long-Life Tokens

#### Initializing the JS SDK

#### Embedding the Loyalty Hub

#### Managing Loyalty Cookies

### Use Cases

#### Customer Syncing

#### Activity Tracking

#### Order Tracking

#### Voucher Issuing

#### External Coupon Source

#### Friend Referral Capabilities

#### Social Share Mechanism

#### Rewarded Points Displaying

#### Sending Custom Events

## Implementation Guide

### Importing Custom Object Definitions

To import custom objects and preferences used by the Antavo cartridges, login to the BM and navigate to 
`Administration -> Site Development -> Import & Export` and click the "Upload" button. Find `int_antavo_metadata.xml` on 
your computer and upload the file. 

Once the upload is complete, click "Back" and then click the "Import" button 
underneath the Meta Data section. Select the Antavo settings file and click "Next" to validate the file. 

Once validated, click the "Import" button to finish the process.

### Importing Service Profiles

Service profiles set up parameters for use in things like HTTP calls 
made by Antavo's SFCC cartridge. These settings specify values for things such 
as the API endpoint, API credentials, and the timeout for making HTTP requests. 

To import the service profiles used by the HTTP services, navigate to `Administration -> Operations -> Import & Export` 
and click the “Upload” button under Import & Export Files. 
Find the `int_antavo_service_profiles.xml` file on your computer and upload the file. 

Once the upload is complete, click "Back" and then click the "Import Button" under Services. 
Select the Antavo service import profiles and go through the validation wizard 
by clicking the “Next” button. Next, navigate to Administration -> Operations -> Services. 

There, ensure that two service profiles for Antavo exist under the Services tab; 
The profile defines the service type, a log prefix, and a profile and credentials mapping. 
The Antavo HTTP services utilize the same settings profile which defines things 
such as timeouts for requests. 

Click on the Profiles tab and verify that a single `AntavoWebServiceProfile` entry exists. 
You may click through on the link to view and change the default settings.

Finally, click on the Credentials tab and verify that a single, `AntavoHTTPCredentials` profile exists. 
Click through on the link to view and update the settings.

Enter your API key as username and API secret as password in the designated fields.
If you do not know your credentials, contact your Account Manager. 
Once finished, click the "Apply" button to save your settings.  

More information on how to set up and assign service profiles to services can 
be found at the official SFCC Documentation repository under
 
`SFCC 16.6 -> Developing your storefront -> Web services`.

SFCC Documentation: https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp  

### Including JS SDK

Include template – a single remote include is necessary to render a JavaScript 
reference to all pages of the storefront for several purposes: social share, 
popups, activity tracking, etc. This code is required to be 
rendered on every page of the storefront. We recommend adding the following line 
to the bottom of your footer include template, which is typically:

```bash
/app_storefront_core/templates/default/components/footer/footer.isml
```

```html
<isinclude url="${URLUtils.url('AntavoJS-Include')}"/>
```

### Including Microsite

#### Preparations for the displaying

If you want to display your Loyalty Hub for your customers, the Microsite URL should be
configured on your Business Manager site.

In order to doing the first step, login to the BM and navigate to 
`Merchant Tools -> Online Marketing -> Antavo Loyalty -> Microsite Configuration` and fill in the
`Microsite URL` input field with the corresponding URL.

On the customer facing side, you can show the Microsite trough a  predefined controller for doing 
that, called `AntavoMicrosite-Show`.

It should be noted that you have to define the page template for the mentioned controller for a better
displaying; you can specify that template on the Business Manager side.

#### Showing the Microsite in the navigation

If you have successfully configured your Loyalty Hub, it's time to show up a link in the Navigation Bar.
We recommend adding the following line to the bottom of your header template, which is typically:

```bash
/app_storefront_core/templates/default/components/header/header.isml
```

```html
<li class="antavo-microsite-menu">
    <a href="${URLUtils.https('AntavoMicrosite-Show')}" title="Loyalty Microsite">
        <i class="fa fa-gift"></i>
        <span>Loyalty Microsite</span>
    </a>
</li>
```

#### Sending customer registrations

##### Add a new checkbox to your registration form

```html
<field formid="loyalty_optin" label="profile.loyalty_optin" type="boolean" />
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/forms/default/profile.xml:12`

##### Show the loyalty opt-in checkbox in the template

Add these lines to your registration template:

```html
<isif condition="${!(customer.authenticated && customer.registered)}">
	<isinputfield formfield="${pdict.CurrentForms.profile.customer.loyalty_optin}" type="checkbox" />
</isif>
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/templates/default/account/user/registration.isml:55`

##### Checkbox localization

You can translate the opt-in checkbox's label through the default Demandware localization facility.
Just add a new entry to your `forms.properties` file, like:

```bash
profile.loyalty_opt_in=I would like to join the loyalty program.
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/templates/resources/forms.properties`

You can translate the checkbox text to other languages. For example, if you want to
translate to German, add a new locale entry to your `forms_de_DE.properties`, like:

```bash
profile.loyalty_optin=Ich möchte dem Treueprogramm beitreten.
profile.loyalty_terms_text=Ich akzeptiere die Bedingungen.
```

With special regards to GDPR, please put your terms & conditons page's link after the injected checkbox.

##### Sending opt-in event to Antavo's API

You should place the following code snippet right after the opt-in code; this code
will perform an API request to the Antavo Events API.

```javascript
var eventHandler = require("int_antavo/cartridge/scripts/events/Handler");
eventHandler.Handler.fire(eventHandler.EVENT_AFTER_CUSTOMER_OPT_IN, this, {
    opt_in: app.getForm("profile").object.customer.loyaltyOptIn.getValue(),
    customer: profileValidation || customer,
});
```

In the SiteGenesis reference controller, you should inject this code to:

`storefront_controllers/cartridge/controllers/Account.js:428`

#### Showing incentivizing points on the product page

If you want to show the amount of the incentivizing points on the product page,
you should place the following code snippet to your price partial:

```html
<isinclude template="antavo/includes/product-points" />
```

Make sure that the `pdict` object contains the Product variable at least.
In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/templates/default/product/components/pricing.isml:158`

#### Showing incentivizing points on the cart page

If you want to show the summarized amount of the incentivizing points on the cart page,
you should place the following code snippet to your cart partial:

```html
<isinclude url="${URLUtils.url('AntavoCart-Include')}" />
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/templates/default/checkout/cart/cart.isml:856`

#### Sending successful checkout events to Antavo

If you want to track customers' checkouts with Antavo, you should place the following
snippet to your checkout controller, where the `order` variable is an Order instance:

```javascript
var eventHandler = require("int_antavo/cartridge/scripts/events/Handler");
eventHandler.Handler.fire(eventHandler.EVENT_AFTER_CHECKOUT, this, { order: order });
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_controllers/cartridge/controllers/COPlaceOrder.js:179`

#### Showing the opt-in button for existing customers

If you want to place an "Opt-in" button for your existing customer, inject the following
code snippet to your customer page.

```html
<isinclude template="antavo/includes/profile/opt-in" />
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/templates/default/account/user/registration.isml:80`

#### Showing the opt-out button for loyalty members

For be able to opt-out from the Loyalty Program, inject the following code snippet
to your account page:

```html
<isinclude template="antavo/includes/profile/opt-out" />
```

In the SiteGenesis reference template, you should inject this code to:

`storefront_core/cartridge/templates/default/account/user/registration.isml:112`

#### Showing customer information on the storefront

If you want to show a specific loyalty information about the customer on the storefront,
just place a new HTML tag to your template in the following format:

```html
<span data-antavo-field-*></span>
```

Where the * can be:

* level
* score
* spent
* spendable
* reserved
* pending

For example:

```html
<p data-antavo-field-pending></p>
```
