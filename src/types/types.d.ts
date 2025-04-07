declare namespace JSX {
    interface IntrinsicElements {
      'mux-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'playback-id'?: string;
        'metadata-video-title'?: string;
        'metadata-viewer-user-id'?: string;
        'stream-type'?: string;
      };
    }
  }
  