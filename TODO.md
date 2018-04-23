Feature
* Introduce type 2 as state
* create a derivative work for Graphana visualization
* Multi-edge visualization without overlap
* Non-overlapping label visualization

Issue
* source should not be editable(?) but export and import: nodes without coordinates require some kind of dynamc placement, e.g. using force layout
When editing attributes, editing blocks because the fields are re-layout. Focus should be managed appropriately 
* Improve visualization of selection
* Handle removal of types
* Edge Labels "jump"
* Attributes are actually tags. An attribute or property which is a key:value type of thing could also be considered

The "Type" is actually associating a name with a visual feature, and is not really a type in traditional sense, maybe could be considered as a "trait" (or "visual trait") or "state". One could in principle consider various arbitrary combinations of css properties and apply them in a cumulative way, which is nothing different than the concept of class in HTML5/CSS. However, picking them visually is challenging (entering css directly could be easier for a start). The web tools in the browser do something similar.

A "Type" in the sense of prototype or template, including the attributes, is missing.

