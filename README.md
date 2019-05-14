# Salesforce Commerce Cloud Cartridge

## Importing API preferences

To import custom objects and preferences used by the Antavo cartridges, login to 
the BM and navigate to Administration -> Site Development -> Import & Export and 
click the “Upload” button. Find int_antavo_metadata.xml on your computer and 
upload the file. Once the upload is complete, click “Back” and then click the 
“Import” button underneath the Meta Data section. Select the Antavo settings file 
and click “Next” to validate the file. Once validated, click the “Import” 
button to finish the process.

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
