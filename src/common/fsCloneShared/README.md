We _could_ create a separate module for each shared directive,
but then each shared directive would need to import the other shared directives that is references in its template.
And we would probably have to avoid circular dependencies between directive templates;
e.g., if template for directive A includes directive B and template for directive B includes directive C,
template for directive C cannot include directive A or B.

This seems like a lot of work to go to up-front before we know whether separate modules per directive are useful.
So for now, put all directives into a single module.
