import {create, act} from 'react-test-renderer';
import Header from '../components/Header'; // The component being tested

// render the component
it("Will test if header receives the name props", () => {
	let root; 
	act(() => {
	  root = create(<Header name='Kadu'/>)
	});

	// make assertions on root 
	expect(root.toJSON()).toMatchSnapshot();

	// update with some different props
	act(() => {
	  root.update(<Header name='Intelie'/>);
	})

	// make assertions on root 
	expect(root.toJSON()).toMatchSnapshot();
});