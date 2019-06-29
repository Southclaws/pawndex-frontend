import * as React from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';

export default () => {
  return (
    <Modal trigger={<Button size="tiny">?</Button>}>
      <Modal.Header>Help</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>This index lists valid Pawn packages from GitHub.</p>
          <p>The icons indicate the classification of the package:</p>
          <ul>
            <li>
              <Icon size="large" name="check circle" color="yellow" verticalAlign="middle" />A full
              Pawn Package that contains package definition file
            </li>
            <li>
              <Icon size="large" name="check circle" color="teal" verticalAlign="middle" />
              Contains .inc or .pwn files at the top-most level, still compatible with{' '}
              <a href="http://bit.ly/sampctl">sampctl</a>.
            </li>
            <li>
              <Icon size="large" name="circle outline" disabled verticalAlign="middle" />A
              repository that contains .inc or .pwn files somewhere, requires user to specify
              include path.
            </li>
          </ul>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
