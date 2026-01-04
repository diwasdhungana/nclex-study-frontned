import { TextInput } from '@mantine/core';
import React from 'react';

interface FieldStyleProps {
  autoFocus?: boolean;
  [key: string]: any;
}

export default class FieldStyle extends React.Component<FieldStyleProps> {
  private ref: any;

  componentDidMount() {
    this.ref && this.ref.focus();
  }

  render() {
    const { autoFocus, ...rest } = this.props;

    // auto focus
    const ref = autoFocus
      ? (ref: any) => {
          this.ref = ref;
        }
      : null;
    return <TextInput ref={ref} type="text" {...rest} />;
  }
}
