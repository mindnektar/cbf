import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HomeModel from 'models/home';
import Form, { FormItem } from 'molecules/Form';
import Collapsible from 'molecules/Collapsible';
import TextField from 'atoms/TextField';
import TextArea from 'atoms/TextArea';
import Button from 'atoms/Button';

const AnnouncementEditor = (props) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (props.isOpen) {
            const announcement = props.data.announcements.find(({ id }) => id === props.id);

            if (announcement) {
                setTitle(announcement.title);
                setText(announcement.text);
            } else {
                setTitle('');
                setText('');
            }
        }
    }, [props.isOpen, props.id]);

    const changeTitle = (event) => {
        setTitle(event.target.value);
    };

    const changeText = (event) => {
        setText(event.target.value);
    };

    const maySubmit = () => (
        !!title.trim() && !!text.trim()
    );

    const submit = () => {
        const mutation = props.id ? 'updateAnnouncement' : 'createAnnouncement';

        props[mutation]({
            id: props.id || undefined,
            title: title.trim(),
            text: text.trim(),
        });

        props.close();
    };

    return (
        <Collapsible collapsed={!props.isOpen}>
            <div className="cbf-home__announcement-editor">
                <Form>
                    <FormItem label="Title">
                        <TextField
                            onChange={changeTitle}
                            onSubmit={submit}
                        >
                            {title}
                        </TextField>
                    </FormItem>

                    <FormItem label="Text">
                        <TextArea onChange={changeText}>
                            {text}
                        </TextArea>
                    </FormItem>

                    <FormItem>
                        <Button
                            onClick={submit}
                            disabled={!maySubmit()}
                        >
                            Submit
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </Collapsible>
    );
};

AnnouncementEditor.defaultProps = {
    id: null,
};

AnnouncementEditor.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    id: PropTypes.string,
    data: PropTypes.object.isRequired,
    createAnnouncement: PropTypes.func.isRequired,
    updateAnnouncement: PropTypes.func.isRequired,
};

export default HomeModel.graphql(AnnouncementEditor);
