/**
 * @fileoverview Contains all Jabber/XMPP packet related classes.
 * @author Stefan Strigler steve@zeank.in-berlin.de
 * @version $Revision$
 */

var JSJACPACKET_USE_XMLNS = true;
/**
 * Creates a new packet with given root tag name (for internal use)
 * @class Somewhat abstract base class for all kinds of specialised packets
 * @param {String} name The root tag name of the packet 
 * (i.e. one of 'message', 'iq' or 'presence')
 */
function JSJaCPacket(name) {
  /**
   * @private
   */
  this.name = name;

  if (typeof(JSJACPACKET_USE_XMLNS) != 'undefined' && JSJACPACKET_USE_XMLNS)
    /**
     * @private
     */
    this.doc = XmlDocument.create(name,'jabber:client');
  else
    /**
     * @private
     */
    this.doc = XmlDocument.create(name,'');

  /**
   * Gets the type (name of root element) of this packet, i.e. one of
   * 'presence', 'message' or 'iq'
   * @return the top level tag name
   * @type String
   */
  this.pType = function() { return this.name; };

  /**
   * Gets the associated Document for this packet.
   * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#i-Document Document}
   */
  this.getDoc = function() { return this.doc; };
  /**
   * Gets the root node of this packet
   * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
   */
  this.getNode = function() { return this.getDoc().documentElement; };

  /**
   * Sets the 'to' attribute of the root node of this packet
   * @param {String} to 
   * @type JSJaCPacket
   */
  this.setTo = function(to) {
    if (!to || to == '')
      this.getNode().removeAttribute('to');
    else if (typeof(to) == 'string')
      this.getNode().setAttribute('to',to); 
    else 
      this.getNode().setAttribute('to',to.toString());
    return this; 
  };
  /**
   * Sets the 'from' attribute of the root node of this
   * packet. Usually this is not needed as the server will take care
   * of this automatically.
   * @type JSJaCPacket
   */
  this.setFrom = function(from) {
    if (!from || from == '')
      this.getNode().removeAttribute('from');
    else if (typeof(from) == 'string')
      this.getNode().setAttribute('from',from); 
    else 
      this.getNode().setAttribute('from',from.toString());
    return this;
  };
  /**
   * Sets 'id' attribute of the root node of this packet.
   * @param {String} id The id of the packet.
   * @type JSJaCPacket
   */
  this.setID = function(id) { 
    if (!id || id == '')
      this.getNode().removeAttribute('id');
    else
      this.getNode().setAttribute('id',id); 
    return this; 
  };
  /**
   * Sets the 'type' attribute of the root node of this packet.
   * @param {String} type The type of the packet.
   * @type JSJaCPacket
   */
  this.setType = function(type) { 
    if (!type || type == '')
      this.getNode().removeAttribute('type');
    else
      this.getNode().setAttribute('type',type);
    return this; 
  };
  /**
   * Sets 'xml:lang' for this packet
   * @param {String} xmllang The xml:lang of the packet.
   * @type JSJaCPacket
   */
  this.setXMLLang = function(xmllang) {
    if (!xmllang || xmllang == '')
      this.getNode().removeAttribute('xml:lang');
    else
      this.getNode().setAttribute('xml:lang',xmllang);
    return this;
  };

  /**
   * Gets the 'to' attribute of this packet
   * @type String
   */
  this.getTo = function() { 
    return this.getNode().getAttribute('to'); 
  };
  /**
   * Gets the 'from' attribute of this packet.
   * @type String
   */
  this.getFrom = function() { 
    return this.getNode().getAttribute('from'); 
  };
  /**
   * Gets the 'to' attribute of this packet as a JSJaCJID object
   * @type JSJaCJID
   */
  this.getToJID = function() { 
    return new JSJaCJID(this.getTo()); 
  };
  /**
   * Gets the 'from' attribute of this packet as a JSJaCJID object
   * @type JSJaCJID
   */
  this.getFromJID = function() { 
    return new JSJaCJID(this.getFrom()); 
  };
  /**
   * Gets the 'id' of this packet
   * @type String
   */
  this.getID = function() { return this.getNode().getAttribute('id'); };
  /**
   * Gets the 'type' of this packet
   * @type String
   */
  this.getType = function() { return this.getNode().getAttribute('type'); };
  /**
   * Gets the 'xml:lang' of this packet
   * @type String
   */
  this.getXMLLang = function() { 
    return this.getNode().getAttribute('xml:lang'); 
  };
  /**
   * Gets the 'xmlns' (xml namespace) of the root node of this packet
   * @type String
   */
  this.getXMLNS = function() { return this.getNode().namespaceURI; };

  /**
   * Gets a child element of this packet.
   * @param {String} name Tagname of child to retrieve.
   * @param {String} ns   Namespace of child
   * @return The child node, null if none found
   * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
   */ 
  this.getChild = function(name, ns) {
    if (!name && this.getNode().firstChild) {
      // best practice
      return this.getNode().firstChild;
    } else {
      var nodes = this.getNode().childNodes;
      for (var i=0; i<nodes.length; i++) {
        if (ns && nodes.item(i).namespaceURI != ns) {
          continue;
        }
        if (nodes.item(i).tagName == name) {
          return nodes.item(i);
        }
      }
    }
    return null; // fallback
  }

  /**
   * Gets the node value of a child element of this packet.
   * @param {String} name Tagname of child to retrieve.
   * @param {String} ns   Namespace of child
   * @return The value of the child node, empty string if none found
   * @type String
   */ 
  this.getChildVal = function(name, ns) {
    var node = this.getChild(name, ns);
    if (node && node.firstChild) {
      return node.firstChild.nodeValue;
    } else {
      return '';
    }
  }

  /**
   * Returns a copy of this node
   * @return a copy of this node
   * @type JSJaCPacket
   */
  this.clone = function() { return JSJaCPacket.wrapNode(this.getNode()); }

  /**
   * Returns a string representation of the raw xml content of this packet.
   * @type String
   */
  this.xml = function() { 
    if (this.getDoc().xml)
      return this.getDoc().xml;
    var xml = (new XMLSerializer()).serializeToString(this.getNode()); // opera needs the node
    if (typeof(xml) != 'undefined') 
      return xml;
    return (new XMLSerializer()).serializeToString(this.doc); // oldschool

  };

  // PRIVATE METHODS DOWN HERE 

  /**
   * Gets an attribute of the root element
   * @private
   */
  this._getAttribue = function(attr) {
    return this.getNode().getAttribute(attr);
  };

  /**
   * Replaces this node with given node
   * @private
   */
  this._replaceNode = function(aNode) {
    // copy attribs
    for (var i=0; i<aNode.attributes.length; i++)
      if (aNode.attributes.item(i).nodeName != 'xmlns')
        this.getNode().setAttribute(aNode.attributes.item(i).nodeName,aNode.attributes.item(i).nodeValue);

    // copy children
    for (var i=0; i<aNode.childNodes.length; i++)
      if (this.getDoc().importNode)
        this.getNode().appendChild(this.getDoc().importNode(aNode.childNodes.item(i),true));
      else
        this.getNode().appendChild(aNode.childNodes.item(i).cloneNode(true));
	
  };
  
  /**
   * Set node value of a child node
   * @private
   */
  this._setChildNode = function(nodeName, nodeValue) {
    var aNode = this.getChild(nodeName);
    var tNode = this.getDoc().createTextNode(nodeValue);
    if (aNode)
      try {
        aNode.replaceChild(tNode,aNode.firstChild);
      } catch (e) { }
    else {
      aNode = this.getNode().appendChild(this.getDoc().createElement(nodeName));
      aNode.appendChild(tNode);
    }
    return aNode;
  }

  /**
   * Builds a node using {@link http://wiki.script.aculo.us/scriptaculous/show/Builder script.aculo.us' Dom Builder} notation.
   * @return The newly create node
   * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
   */
  this.buildNode = function(elementName) {
    //    elementName = elementName.toLowerCase();

    var doc = this.getDoc();

    // try innerHTML approach
    var parentTag = this.pType();
    // we cannot use this.getNode() here as with the innerHTML
    // approach we would wipe out all pre-existing childnodes.
    var parentElement = doc.createElement(parentTag);
    try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
      parentElement.innerHTML = "<" + elementName + "></" + elementName + ">";
    } catch(e) {}
    var element = parentElement.firstChild || null;
      
    // see if browser added wrapping tags
    if(element && (element.tagName.toUpperCase() != elementName))
      element = element.getElementsByTagName(elementName)[0];
    
    // fallback to createElement approach
    if(!element) element = doc.createElement(elementName);
    
    // abort if nothing could be created
    if(!element) return;

    // attributes (or text)
    if(arguments[1])
      if(JSJaCBuilder._isStringOrNumber(arguments[1]) ||
         (arguments[0] instanceof Array)) {
        JSJaCBuilder._children(doc, element, arguments[1]);
      } else {
        var attrs = JSJaCBuilder._attributes(arguments[1]);
        if(attrs.length) {
          try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
            parentElement.innerHTML = "<" +elementName + " " +
              attrs + "></" + elementName + ">";
          } catch(e) {}
          element = parentElement.firstChild || null;
          // workaround firefox 1.0.X bug
          if(!element) {
            element = doc.createElement(elementName);
            for(attr in arguments[1]) {
              if (arguments[1].hasOwnProperty(attr)) {
                element.setAttribute(attr, arguments[1][attr]);
              }}
            
          }
          if(element.tagName != elementName)
            element = parentElement.getElementsByTagName(elementName)[0];
        }
      } 
    
    // text, or array of children
    if(arguments[2])
      JSJaCBuilder._children(doc, element, arguments[2]);
    
    return element;
  };

  /**
   * Appends node created by buildNode to this packets parent node.
   * @see #buildNode
   * @return This packet
   * @type JSJaCPacket
   */
  this.appendNode = function(elementName) {
    this.getNode().appendChild(this.buildNode(elementName, arguments[1], arguments[2]));
    return this;
  };
}

/**
 * @private
 */
var JSJaCBuilder = {

  _text: function(doc, text) {
    return doc.createTextNode(text);
  },

  _children: function(doc, element, children) {
    if(typeof children=='object') { // array can hold nodes and text
//       children.flatten().each( function(e) {
      for (var e in children) {
        if (children.hasOwnProperty(e)) {
          if(typeof children[e]=='object') {
            element.appendChild(children[e])
          } else {
            if(JSJaCBuilder._isStringOrNumber(children[e])) {
              element.appendChild(JSJaCBuilder._text(doc, children[e]));
            }
          }
        }
      }
    } else
      if(JSJaCBuilder._isStringOrNumber(children)) 
        element.appendChild(JSJaCBuilder._text(doc, children));
  },

  _attributes: function(attributes) {
    var attrs = [];
    for(attribute in attributes)
      if (attributes.hasOwnProperty(attribute))
        attrs.push(attribute +
          '="' + attributes[attribute].toString().htmlEnc() + '"');
    return attrs.join(" ");
  },

  _isStringOrNumber: function(param) {
    return(typeof param=='string' || typeof param=='number');
  }

} 

/**
 * A jabber/XMPP presence packet
 * @class Models the XMPP notion of a 'presence' packet
 * @extends JSJaCPacket
 */
function JSJaCPresence() {
  /**
   * @ignore
   */
  this.base = JSJaCPacket;
  this.base('presence');

  /**
   * Sets the status for this presence packet. 
   * @param {String} status An XMPP complient status indicator. Must
   * be one of 'chat', 'away', 'xa', 'dnd', 'available', 'unavailable'
   * @return this
   * @type JSJaCPacket
   */
  this.setStatus = function(status) {
    this._setChildNode("status", status);
    return this; 
  };
  /** 
   * Sets the status message for current status. Usually this is set
   * to some human readable string indicating what the user is
   * doing/feel like currently.
   * @param {String} show A status message
   * @return this
   * @type JSJaCPacket
   */
  this.setShow = function(show) {
    this._setChildNode("show",show);
    return this; 
  };
  /**
   * Sets the priority of the resource bind to with this connection
   * @param {int} prio The priority to set this resource to
   * @return this
   * @type JSJaCPacket
   */
  this.setPriority = function(prio) {
    this._setChildNode("priority", prio);
    return this; 
  };
  /**
   * Some combined method that allowes for setting show, status and
   * priority at once
   * @param {String} show A status message
   * @param {String} status A status indicator as defined by XMPP
   * @param {int} prio A priority for this resource
   * @return this
   * @type JSJaCPacket
   */
  this.setPresence = function(show,status,prio) {
    if (show)
      this.setShow(show);
    if (status)
      this.setStatus(status);
    if (prio)
      this.setPriority(prio);
    return this; 
  };

  /**
   * Gets the status of this presence
   * @return The status indicator as defined by XMPP
   * @type String
   */
  this.getStatus = function() {	return this.getChildVal('status');	};
  /**
   * Gets the status message of this presence
   * @return The status message
   * @type String
   */
  this.getShow = function() { return this.getChildVal('show'); };
  /**
   * Gets the priority of this status message
   * @return A resource priority
   * @type int
   */
  this.getPriority = function() { return this.getChildVal('priority'); };
}

/**
 * A jabber/XMPP iq packet
 * @class Models the XMPP notion of an 'iq' packet
 * @extends JSJaCPacket
 */
function JSJaCIQ() {
  /**
   * @ignore
   */
  this.base = JSJaCPacket;
  this.base('iq');

  /**
   * Some combined method to set 'to', 'type' and 'id' at once
   * @param {String} to the recepients JID
   * @param {String} type A XMPP compliant iq type (one of 'set', 'get', 'result' and 'error'
   * @param {String} id A packet ID
   * @return this
   * @type JSJaCIQ
   */
  this.setIQ = function(to,type,id) {
    if (to)
      this.setTo(to);
    if (type)
      this.setType(type);
    if (id)
      this.setID(id);
    return this; 
  };
  /**
   * Creates a 'query' child node with given XMLNS
   * @param {String} xmlns The namespace for the 'query' node
   * @return The query node
   * @type {@link  http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
   */
  this.setQuery = function(xmlns) {
    var query;
    try {
      query = this.getDoc().createElementNS(xmlns,'query');
    } catch (e) {
      // fallback
      query = this.getDoc().createElement('query');
    }
    if (query && query.getAttribute('xmlns') != xmlns) // fix opera 8.5x
      query.setAttribute('xmlns',xmlns);
    this.getNode().appendChild(query);
    return query;
  };

  /**
   * Gets the 'query' node of this packet
   * @return The query node
   * @type {@link  http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
   */
  this.getQuery = function() {
    return this.getNode().getElementsByTagName('query').item(0);
  };
  /**
   * Gets the XMLNS of the query node contained within this packet
   * @return The namespace of the query node
   * @type String
   */
  this.getQueryXMLNS = function() {
    if (this.getQuery())
      return this.getQuery().namespaceURI;
    else
      return null;
  };
}

/**
 * A jabber/XMPP message packet
 * @class Models the XMPP notion of an 'message' packet
 * @extends JSJaCPacket
 */
function JSJaCMessage() {
  /**
   * @ignore
   */
  this.base = JSJaCPacket;
  this.base('message');

  /**
   * Sets the body of the message
   * @param {String} body Your message to be sent along
   * @return this message
   * @type JSJaCMessage
   */
  this.setBody = function(body) {
    this._setChildNode("body",body);
    return this; 
  };
  /**
   * Sets the subject of the message
   * @param {String} subject Your subject to be sent along
   * @return this message
   * @type JSJaCMessage
   */
  this.setSubject = function(subject) {
    this._setChildNode("subject",subject);
    return this; 
  };
  /**
   * Sets the 'tread' attribute for this message. This is used to identify
   * threads in chat conversations
   * @param {String} thread Usually a somewhat random hash.
   * @return this message
   * @type JSJaCMessage
   */
  this.setThread = function(thread) {
    this._setChildNode("thread", thread);
    return this; 
  };
  /**
   * Sets the nick to be sent along with this message
   * @param {String} nick The nick used with this message
   * @return this message
   * @type JSJaCMessage
   */
  this.setNickname = function(nick) {
    this._setChildNode("nick",nick).setAttribute("xmlns","http://jabber.org/protocol/nick");
    return this;
  }

  /**
   * Gets the 'thread' identifier for this message
   * @return A thread identifier
   * @type String
   */
  this.getThread = function() { return this.getChildVal('thread'); };
  /**
   * Gets the body of this message
   * @return The body of this message
   * @type String
   */
  this.getBody = function() { return this.getChildVal('body'); };
  /**
   * Gets the subject of this message
   * @return The subject of this message
   * @type String
   */
  this.getSubject = function() { return this.getChildVal('subject') };
  /**
   * Gets the nickname of this message
   * @return The nick
   * @type String
   */
  this.getNickname = function() {
    return this.getChildVal('nick', 'http://jabber.org/protocol/nick');
  }

}

/**
 * Tries to Transform a w3c DOM node to JSJaC's internal representation 
 * (JSJaCPacket type, one of JSJaCPresence, JSJaCMessage, JSJaCIQ)
 * @param: {Node
 * http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247}
 * node The node to be transformed
 * @return A JSJaCPacket representing the given node. If node's root
 * elemenent is not one of 'message', 'presence' or 'iq',
 * <code>null</code> is being returned.
 * @type JSJaCPacket
 */
JSJaCPacket.wrapNode = function(node) {
  var aNode;
  switch (node.nodeName.toLowerCase()) {
  case 'presence':
    aNode = new JSJaCPresence();
    break;
  case 'message':
    aNode = new JSJaCMessage();
    break;
  case 'iq':
    aNode = new JSJaCIQ();
    break;
  default : // unknown
    return null;
  }

  aNode._replaceNode(node);

  return aNode;
}

