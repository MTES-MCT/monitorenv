
UPDATE public.env_actions SET
  value = jsonb_set(
    value,
		'{themes}',
		jsonb_build_array(
      jsonb_build_object(
          'theme', value->'actionTheme',
          'subThemes', jsonb_build_array(value->>'actionSubTheme')
      )
    ))
    - 'actionTheme' 
    - 'actionSubTheme'
  WHERE 
    value->>'actionTheme' not like '';