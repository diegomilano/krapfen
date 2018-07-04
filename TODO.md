Feature
* create a derivative work for Graphana visualization
* Non-overlapping label visualization
* Attributes are actually tags. An attribute or property which is a key:value type of thing could also be considered
* The "Type" is actually associating a name with a visual feature, and is not really a type in traditional sense, maybe could be considered as a "visual trait" or style. One could in principle consider various arbitrary combinations of css properties and apply them in a cumulative way, which is nothing different than the concept of class in HTML5/CSS. However, picking them visually is challenging (entering css directly could be easier for a start). The web tools in the browser do something similar.
* A "Type" in the sense of prototype or template, including the attributes, is missing.
* Add a *visibility* feature to individual nodes and edges. It should be possible to simply hide nodes and then individual edges related to that node are hidden as well. Nodes hidden this way should be out of the way but not lost, there needs to be a mechanism to recover them. Perhaps a toggle that show again all nodes marked as hidden. An alternative would be to play on their transparency and make them "almost" invisible. [done]
* Add button to lock the editor into a "view only" mode [done]
* Add brush selection

Issue
* At import, nodes without coordinates require some kind of dynamic placement, e.g. using force layout. Add a layout button.
* When editing attributes, editing blocks because the fields are re-layout. Focus should be managed appropriately 
* Handle removal of types and attributes
* self-relationships are not shown (loops) [done]
* source should not be editable(?) but export and import.[done]
* Edge Labels "jump" [done]
* Multi-edge visualization without overlap [done]
* optimize link placement, currently placement functions are being called for each link at least twice because of the clickable overlay.[done]


