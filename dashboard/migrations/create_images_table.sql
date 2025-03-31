-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for the images table
-- Allow anyone to select images
CREATE POLICY "Public read access for images"
ON images FOR SELECT
USING (true);

-- Allow authenticated users to insert images
CREATE POLICY "Authenticated users can insert images"
ON images FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update their own images"
ON images FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete their own images"
ON images FOR DELETE
TO authenticated
USING (true);

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for the images bucket
CREATE POLICY "Public Access for images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Create policy to allow authenticated users to insert into the images bucket
CREATE POLICY "Authenticated users can upload to images bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Create policy to allow authenticated users to update objects in the images bucket
CREATE POLICY "Authenticated users can update objects in images bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Create policy to allow authenticated users to delete objects from the images bucket
CREATE POLICY "Authenticated users can delete from images bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

