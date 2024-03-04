import os
import re
import uuid
import argparse
import xml.etree.ElementTree as ET

# Define the variables
BASE_URL = "https://mooc-forums.inria.fr/moocrr2"
LAUNCH_URL = "/auth/lti/callback"
LTI_ID = "moocrr2"

def append_lti_to_verticals(base_url, launch_url, lti_id, dry_run):
    file_names = []

    # Walk through the 'vertical' directory
    for dirpath, dirnames, filenames in os.walk('vertical'):
        for file in filenames:
            # Only process .xml files
            if file.endswith('.xml'):
                file_path = os.path.join(dirpath, file)

                # Parse the XML file
                tree = ET.parse(file_path)
                vertical = tree.getroot()

                if vertical is not None:
                    # Find in which sequence is it used
                    sequential_file, sequence_name = find_node_in_xml('vertical', file, 'sequential')
                    chapter_file, chapter_name = find_node_in_xml('sequential', sequential_file, 'chapter')
                    fullpath = chapter_name + ' / ' + sequence_name + ' / ' + vertical.get('display_name')
                    url = base_url + '/c/' + transform_fullpath_to_discourse_category_name(fullpath)

                    # Call insert_lti_forum to create a new LTI and get the UUID value
                    file_name, uuid_value = insert_lti_forum(base_url, launch_url, lti_id, dry_run)
                    file_names.append(file_name)

                    print('Full category path : ' + fullpath)
                    print('Corresponding URL : ' + url)
                    # Create a new 'lti' node and append it to the 'vertical' node
                    lti = ET.SubElement(vertical, "lti", url_name=uuid_value)
                    lti.tail = "\n"

                # Indent the XML tree with 2 spaces
                ET.indent(tree, space='  ')

                # Write the modified XML structure back to the file
                if not(dry_run):
                    tree.write(file_path, xml_declaration=False, encoding='utf-8', method="xml")

    return file_names

def insert_lti_forum(base_url, launch_url, lti_id, dry_run):
    # Create a random 32 characters hexadecimal name
    file_id = uuid.uuid4().hex
    file_name = file_id + '.xml'

    # Create the xml file in the 'lti' folder
    file_path = os.path.join('lti', file_name)

    # Create the XML structure
    root = ET.Element("root")
    lti = ET.SubElement(root, "lti",
                        ask_to_send_email="true",
                        ask_to_send_username="true",
                        custom_parameters='["url=base_url"]'.replace("base_url", base_url),
                        display_name="Forum",
                        launch_url=launch_url,
                        lti_id=lti_id,
                        open_in_a_new_page="false")

    # Write the XML structure to the file
    tree = ET.ElementTree(root)
    if not(dry_run):
        tree.write(file_path, xml_declaration=False, encoding='utf-8', method="xml")

    return file_name, file_id

def find_node_in_xml(node_tag, node_id, directory):
    # Remove the file extension from the node_id
    node_id = os.path.splitext(node_id)[0]

    # Iterate over each file in the directory
    for filename in os.listdir(directory):
        # Check if the file is an XML file
        if filename.endswith('.xml'):
            # Parse the XML file
            tree = ET.parse(os.path.join(directory, filename))
            root = tree.getroot()

            # Find the node element with the given URL name
            node = root.find(f'.//{node_tag}[@url_name="{node_id}"]')

            # If the node was found, return the filename
            if node is not None:
                display_name = root.get('display_name')
                return filename, display_name

    # If the vertical was not found in any file, return None
    return None

def transform_fullpath_to_discourse_category_name(s):
    s = re.sub(r'\[[^\]]*\]', '', s)
    # Split the string at the first '/'
    parts = s.split('/', 1)

    # Transform the first part
    part1 = re.sub('Module ', 'm', parts[0])
    part1 = re.sub('[^0-9a-zA-Z]+', ' ', part1)
    part1 = part1.replace(' ', '-')
    part1 = part1.lower()
    part1 = re.sub('-+', '-', part1)

    # Transform the second part (if it exists)
    if len(parts) > 1:
        # Split the second part at the last '/'
        subparts = parts[1].rsplit('/', 1)

        # Transform the first subpart
        subpart1 = re.sub('[^0-9a-zA-Z]+', ' ', subparts[0])
        subpart1 = subpart1.replace(' ', '-')
        subpart1 = subpart1.lower()
        subpart1 = re.sub('-+', '-', subpart1)

        # Combine the transformed subparts
        module_numbers = re.findall(r'(\d-\d*)+', subpart1)
        if module_numbers:
            module_number = 'm' + module_numbers[0].replace('.', '-')
        else:
            module_number = re.findall(r'\d+', part1)[0]

        # Transform the second subpart
        subpart2 = (module_number + subparts[1])[:50]
        subpart2 = re.sub('[^0-9a-zA-Z]+', ' ', subpart2)
        subpart2 = subpart2.replace(' ', '-')
        subpart2 = subpart2.lower()
        subpart2 = re.sub('-+', '-', subpart2)

        part2 = '/' + subpart2
    else:
        part2 = ''

    return part1.strip('-') + part2.strip('-')

def main(dry_run):
    if dry_run:
        print("Dry run mode. No changes will be made.")
    else:
        print("Normal run mode. Changes will be made.")

    # Call append_lti_to_verticals with default values
    file_names = append_lti_to_verticals(BASE_URL, LAUNCH_URL, LTI_ID, dry_run)
    print('Created ' + str(len(file_names)) + ' lti components')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some data.')
    parser.add_argument('--dry-run', action='store_true', help='Dry run mode. No changes will be made.')
    args = parser.parse_args()

    main(args.dry_run)