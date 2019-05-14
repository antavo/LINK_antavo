# Salesforce Commerce Cloud Cartridge

## Importing Service Profiles

Service profiles set up parameters for use in things like HTTP calls 
made by Antavo's SFCC cartridge. These settings specify values for things such 
as the API endpoint, API credentials, and the timeout for making HTTP requests. 

To import the service profiles used by the HTTP services, navigate to
 
`Administration -> Operations -> Import & Export` 

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

## Including JS SDK
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
