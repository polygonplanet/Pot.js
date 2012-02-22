//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of MimeType.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * MIME Types utilities.
   *
   * This object is not use "navigator.mimeTypes"
   *   for x-browser and non-browser environment.
   *
   * @name Pot.MimeType
   * @type Object
   * @class
   * @static
   * @public
   */
  MimeType : {}
});

update(Pot.MimeType, {
  /**
   * @lends Pot.MimeType
   */
  /**
   * Gets the extension name from the MIME Type.
   *
   *
   * @example
   *   debug( getExtByMimeType('application/javascript') );
   *   // @results 'js'
   *
   *
   * @param  {String}  mimeType   MIME Type.
   * @return {String}             Extension name.
   * @type  Function
   * @function
   * @static
   * @public
   */
  getExtByMimeType : function(mimeType) {
    var result = '', ext, mime, mimes,
        mtype, ltype, part, i, len,
        maps = Pot.MimeType.MimeTypeMaps,
        type = trim(mimeType).toLowerCase();
    if (type) {
      each(maps, function(v, k) {
        ext = k;
        mime = String(v).toLowerCase();
        if (mime === type) {
          result = ext;
          throw Pot.StopIteration;
        }
      });
      if (!result) {
        each(maps, function(v, k) {
          ext = k;
          mime = String(v).toLowerCase().split('/').pop();
          if (~type.indexOf(mime)) {
            result = ext;
            throw Pot.StopIteration;
          }
        });
        if (!result) {
          try {
            // helper if not match.
            if (typeof navigator === 'object' && navigator.mimeTypes) {
              mimes = navigator.mimeTypes;
              if (type in mimes) {
                mime = mimes[type];
                if (mime && mime.suffixes) {
                  mtype = mime;
                }
              } else {
                part = type.split('/').pop();
                len = mimes.length;
                for (i = 0; i < len; i++) {
                  mime = mimes[i];
                  if (mime && mime.suffixes) {
                    ltype = String(mime.type).toLowerCase();
                    if (~ltype.indexOf(type) || ~type.indexOf(ltype) ||
                        ~part.indexOf(ltype.split('/').pop()) ||
                        ~ltype.split('/').pop().indexOf(part)) {
                      mtype = mime;
                      break;
                    }
                  }
                }
              }
              if (mtype) {
                result = String(mtype.suffixes).replace(/^\s*(\w+).*$/, '$1');
              }
            }
          } catch (e) {
            result = '';
          }
        }
      }
    }
    return stringify(result, true);
  },
  /**
   * Gets the MIME Type from the extension name.
   *
   *
   * @example
   *   debug( getMimeTypeByExt('js') );
   *   // @results 'application/javascript'
   *
   *
   * @param  {String}   extension   Extension name.
   * @return {String}               MIME Type.
   * @type  Function
   * @function
   * @static
   * @public
   */
  getMimeTypeByExt : function(extension) {
    var result = '', ext, mimes, mime, re, i, len,
        maps = Pot.MimeType.MimeTypeMaps;
    if (~String(extension).indexOf('.')) {
      if (Pot.URI) {
        ext = trim(Pot.URI.getExt(extension)).toLowerCase();
      } else {
        ext = trim(extension).toLowerCase().split('.').pop();
      }
    } else {
      ext = trim(extension).toLowerCase();
    }
    if (ext in maps) {
      result = maps[ext];
    }
    if (!result) {
      try {
        if (typeof navigator === 'object' && navigator.mimeTypes) {
          mimes = navigator.mimeTypes;
          re = new RegExp('(?:^|\\b)' + rescape(ext) + '(?:\\b|$)', 'i');
          len = mimes.length;
          for (i = 0; i < len; i++) {
            mime = mimes[i];
            if (mime && re.test(mime.suffixes)) {
              result = trim(mime.type);
              break;
            }
          }
        }
      } catch (e) {
        result = '';
      }
    }
    return stringify(result, true) || '*/*';
  },
  /**
   * A basic MIME Type object map.
   *
   * @type  Object
   * @const
   * @static
   * @public
   */
  MimeTypeMaps : {
    // text/basic
    ''   : 'application/octet-stream',
    bin  : 'application/octet-stream',
    txt  : 'text/plain',
    html : 'text/html',
    htm  : 'text/html',
    php  : 'text/html',
    css  : 'text/css',
    js   : 'application/javascript',
    json : 'application/json',
    xml  : 'application/xml',
    swf  : 'application/x-shockwave-flash',
    flv  : 'video/x-flv',
    rdf  : 'application/rdf+xml',
    xul  : 'application/vnd.mozilla.xul+xml',
    // images
    png  : 'image/png',
    jpg  : 'image/jpeg',
    jpe  : 'image/jpeg',
    jpeg : 'image/jpeg',
    gif  : 'image/gif',
    bmp  : 'image/bmp',
    ico  : 'image/vnd.microsoft.icon',
    tiff : 'image/tiff',
    tif  : 'image/tiff',
    svg  : 'image/svg+xml',
    svgz : 'image/svg+xml',
    // archives
    zip  : 'application/zip',
    rar  : 'application/x-rar-compressed',
    msi  : 'application/x-msdownload',
    exe  : 'application/x-msdownload',
    cab  : 'application/vnd.ms-cab-compressed',
    jar  : 'application/java-archive',
    lzh  : 'application/x-lzh-compressed',
    lha  : 'application/x-lzh-compressed',
    afa  : 'application/x-astrotite-afa',
    z    : 'application/x-compress',
    taz  : 'application/x-compress',
    bz2  : 'application/x-bzip',
    gz   : 'application/x-gzip',
    tgz  : 'application/x-gzip',
    tar  : 'application/x-tar',
    '7z' : 'application/x-7z-compressed',
    // audio/video
    au   : 'audio/basic',
    snd  : 'audio/basic',
    aif  : 'audio/x-aiff',
    aiff : 'audio/x-aiff',
    aifc : 'audio/x-aiff',
    m3u  : 'audio/x-mpegurl',
    ram  : 'audio/x-pn-realaudio',
    ra   : 'audio/x-pn-realaudio',
    rm   : 'application/vnd.rn-realmedia',
    wav  : 'audio/x-wav',
    midi : 'audio/midi',
    mid  : 'audio/midi',
    kar  : 'audio/midi',
    mp3  : 'audio/mpeg',
    mp2  : 'audio/mpeg',
    mpga : 'audio/mpeg',
    mp4  : 'video/mp4',
    mov  : 'video/quicktime',
    qt   : 'video/quicktime',
    mpeg : 'video/mpeg',
    mpg  : 'video/mpeg',
    mpe  : 'video/mpeg',
    mxu  : 'video/vnd.mpegurl',
    m4u  : 'video/vnd.mpegurl',
    avi  : 'video/x-msvideo',
    // adobe
    pdf  : 'application/pdf',
    psd  : 'image/vnd.adobe.photoshop',
    ps   : 'application/postscript',
    ai   : 'application/postscript',
    eps  : 'application/postscript',
    // ms office
    doc  : 'application/msword',
    rtf  : 'application/rtf',
    xls  : 'application/vnd.ms-excel',
    ppt  : 'application/vnd.ms-powerpoint',
    // open office
    odt  : 'application/vnd.oasis.opendocument.text',
    ods  : 'application/vnd.oasis.opendocument.spreadsheet'
  }
});

// Update Pot object.
Pot.update({
  getExtByMimeType : Pot.MimeType.getExtByMimeType,
  getMimeTypeByExt : Pot.MimeType.getMimeTypeByExt
});
